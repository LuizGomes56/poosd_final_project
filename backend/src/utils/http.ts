import { writeFileSync } from "fs";
import { Response } from "express";
import { fileURLToPath } from "url";

type HttpBody = Record<string, any>;

export type HttpBuilder<Body extends HttpBody | undefined = undefined, Msg extends boolean = false> = HttpResponseBuilder<Body, Msg>;

class HttpResponseBuilder<
    Body extends HttpBody | undefined = undefined,
    Msg extends boolean = false
> {
    /**
     * Similar to Rust's PhantomData. Do not remove because this is used 
     * for type inference
     */
    declare public __phantom_body?: (value: Body) => Body;
    declare public __phantom_message?: (value: Msg) => Msg;

    private constructor(
        public _status: number,
        public _message?: string,
        public _body?: Body
    ) { }

    static status(status: number): HttpResponseBuilder {
        return new HttpResponseBuilder(status);
    }

    public message(message: string): HttpResponseBuilder<Body, true> {
        return new HttpResponseBuilder(
            this._status,
            message,
            this._body
        );
    }

    public body<B extends HttpBody>(body: B): HttpResponseBuilder<B, Msg> {
        return new HttpResponseBuilder(
            this._status,
            this._message,
            body
        );
    }

    public send(res: Response) {
        return res.status(this._status).json(this.json());
    }

    public json() {
        return {
            ok: this._status >= 200 && this._status < 300,
            status: this._status,
            message: this._message as Msg extends true ? string : undefined,
            body: this._body as Body
        };
    }
}

export const HttpResponse = (() => {
    const statuses = {
        Ok: 200,
        BadRequest: 400,
        Unauthorized: 401,
        NotFound: 404,
        InternalServerError: 500,
        NotImplemented: 501
    };

    const methods = {} as Record<string, any>;

    for (const [f, status] of Object.entries(statuses)) {
        methods[f] = (() => HttpResponseBuilder.status(status));
    }

    type Methods = {
        [K in keyof typeof statuses]: () => HttpResponseBuilder;
    };

    return methods as Methods;
})();

export function getRouteMethods(express: any) {
    const routes = {} as Record<string, string>;
    const protectedRoutes = new Set<string>();

    function normalizePath(path: string) {
        if (!path) return "";
        let result = path.replace(/\/+/g, "/");
        result = result.replace(/^\/api\//, "");
        result = result.replace(/\/:[^/]+/g, "");
        result = result.replace(/\/$/, "");
        return result;
    }

    function getLayerMountPath(layer: any) {
        const source = layer?.regexp?.source;
        if (!source) return "";

        if (source === "^\\/?(?=\\/|$)") {
            return "";
        }

        return source
            .replace("^\\", "")
            .replace("\\/?(?=\\/|$)", "")
            .replace(/\\\//g, "/");
    }

    function isAuthenticationLayer(layer: any) {
        return layer?.name === "authentication";
    }

    function extractRoutes(
        stack: any[],
        basePath = "",
        inheritedProtected = false
    ) {
        let stackProtected = inheritedProtected;
        const protectedMounts = new Set<string>();

        for (const layer of stack) {
            const mountFragment = getLayerMountPath(layer);
            const mountPath = normalizePath(basePath + mountFragment);

            if (layer.route) {
                const methods = Object.keys(layer.route.methods)
                    .map((m) => m.toUpperCase())
                    .join(", ");

                const cleanPath = normalizePath(basePath + layer.route.path);

                routes[cleanPath] = methods;

                const routeProtected =
                    stackProtected ||
                    layer.route.stack.some((routeLayer: any) =>
                        isAuthenticationLayer(routeLayer)
                    );

                if (routeProtected) {
                    protectedRoutes.add(cleanPath);
                }

                continue;
            }

            if (isAuthenticationLayer(layer)) {
                if (mountPath === normalizePath(basePath)) {
                    stackProtected = true;
                } else {
                    protectedMounts.add(mountPath);
                }
                continue;
            }

            if (layer.name === "router" && layer.handle?.stack) {
                const nestedProtected =
                    stackProtected || protectedMounts.has(mountPath);

                extractRoutes(layer.handle.stack, mountPath, nestedProtected);
            }
        }
    }

    const router = express._router;

    if (router) {
        extractRoutes(router.stack);
    } else {
        console.warn("No route registered in the app");
    }

    delete routes["*"];

    const routesObjectEntries = Object.entries(routes)
        .map(([route, method]) => `    "${route}": "${method}",`)
        .join("\n");

    const routesTypeDef =
        `export const BACKEND_ROUTES = {\n${routesObjectEntries}\n} as const;\n`;

    const protectedRoutesDef = [...protectedRoutes]
        .map((route) => `"${route}"`)
        .join(",\n\t");

    const protectedRoutesTypeDef =
        `\nexport const BACKEND_PROTECTED_ROUTES = [\n\t${protectedRoutesDef}\n] as const;\n`;

    const result = routesTypeDef + protectedRoutesTypeDef;

    const filePath = fileURLToPath(
        new URL("../../src/routes/methods.ts", import.meta.url)
    );

    writeFileSync(filePath, result, "utf-8");
}