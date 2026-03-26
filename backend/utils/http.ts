import { writeFileSync } from "fs";
import path from "path";
import type { SwaggerDocs } from "../routes/types";
import { BACKEND_ROUTES } from "../routes/methods";

export interface HttpResponse<T extends Record<string, any> = {}> {
    ok: boolean,
    status: HttpStatus,
    message?: string,
    /**
     * Must be a valid json object. This is what will be sent back to the frontend
     */
    body?: T
}

export enum HttpStatus {
    Ok = 200,
    NotFound = 404,
    BadRequest = 400,
    Unauthorized = 401,
    InternalServerError = 500,
    NotImplemented = 501
}

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