import { writeFileSync } from "fs";
import path from "path";
import type { SwaggerDocs } from "../routes/types";
import { BACKEND_ROUTES } from "../routes/methods";
import { Response } from "express";

type HttpBody = Record<string, any>;

export type HttpBuilder<T extends HttpBody = {}> = HttpResponseBuilder<T>;

class HttpResponseBuilder<T extends HttpBody = {}> {
    private constructor(
        private readonly _status: number,
        private readonly _message?: string,
        private readonly _body?: T
    ) { }

    static status(status: number) {
        return new HttpResponseBuilder(status);
    }

    public message(
        message: string
    ) {
        return new HttpResponseBuilder(this._status, message, this._body);
    }

    public body<B extends HttpBody>(body: B) {
        return new HttpResponseBuilder(this._status, this._message, body);
    }

    public send(res: Response) {
        res.status(this._status).json(this.json());
    }

    public json() {
        return {
            ok: this._status >= 200 && this._status < 300,
            status: this._status,
            message: this._message,
            body: this._body || {}
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
    };

    const methods = {
        NotImplemented: () => HttpResponseBuilder
            .status(501)
            .message("This route was not yet implemented")
    };

    for (const [f, status] of Object.entries(statuses)) {
        methods[f] = (() => HttpResponseBuilder.status(status));
    }

    type Methods = typeof methods & {
        [K in keyof typeof statuses]: () => HttpResponseBuilder;
    };

    return methods as Methods;
})();

/**
 * Export to frontend
 */
export async function api<
    P extends keyof SwaggerDocs,
    I extends SwaggerDocs[P]["input"],
    O extends SwaggerDocs[P]["output"]
>(path: P, ...input: I extends undefined ? [] : [I]): Promise<O> {
    const method = BACKEND_ROUTES[path];
    // Fetch must have to include credentials: include in the 
    // fetch json, additionally the JWT on the backend must be 
    // set to HttpOnly flag
    return 0 as any;
}

// const s = api("users/login", {
//     "email": "",
//     "password": ""
// }).then(r => {
//     if (r.body) {
//         return r.body.token;
//     }
// });

export function getRouteMethods(express: any) {
    const routes = {};

    function extractRoutes(stack: any[], basePath = "") {
        stack.forEach((middleware) => {
            if (middleware.route) {
                const methods = Object.keys(middleware.route.methods)
                    .map(m => m.toUpperCase())
                    .join(', ');
                let cleanPath = basePath.replace(/^\/api\//, '') + middleware.route.path;
                cleanPath = cleanPath.replace(/\/:[^/]+/g, '');
                cleanPath = cleanPath.replace(/\/$/, '');
                routes[cleanPath] = methods;
            } else if (middleware.name === "router" && middleware.handle.stack) {
                extractRoutes(
                    middleware.handle.stack,
                    basePath + (middleware.regexp.source.replace("^\\", "").replace("\\/?(?=\\/|$)", "") || '')
                );
            }
        });
    }

    const router = express._router;

    if (router) {
        extractRoutes(router.stack);
    } else {
        console.warn("No route registered in the app");
    }
    const routesObjectEntries = Object.entries(routes)
        .map(([route, method]) => `    "${route}": "${method}",`)
        .join("\n");
    const routesTypeDef = `export const BACKEND_ROUTES = {\n${routesObjectEntries}\n} as const;\n`;

    const filePath = path.resolve(__dirname, `../routes/methods.ts`);
    writeFileSync(filePath, routesTypeDef, 'utf-8');
}