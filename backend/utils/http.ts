import { writeFileSync } from "fs";
import path from "path";
import { RouteSchema } from "../routes/schema";

export interface HttpResponse<T extends Record<string, any> = {}> {
    ok: boolean,
    status: HttpStatus,
    message?: string,
    body?: T
}

export enum HttpStatus {
    Ok = 200,
    NotFound = 404,
    BadRequest = 400,
    InternalServerError = 500
}

export async function api<
    P extends keyof RouteSchema,
    M extends RouteSchema[P]["method"],
    I extends RouteSchema[P]["input"],
    O extends RouteSchema[P]["output"]
>(path: P, method: M, input: I): Promise<O> {
    //Fetch must have to include credentials: include in the 
    //fetch json, additionally the JWT on the backend must be 
    //set to HttpOnly flag
    return 0 as any;
}

// const s = api("users/login", "POST", {
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
    if (express._router) {
        extractRoutes(express._router.stack);
    } else {
        console.warn("No route registered in the app");
    }
    const routesObjectEntries = Object.entries(routes)
        .map(([route, method]) => `    "${route}": "${method}",`)
        .join("\n");
    const routesTypeDef = `// THIS IS AUTOMATICALLY GENERATED. DON'T CHANGE THIS FILE\nexport const Routes = {\n${routesObjectEntries}\n} as const;\n`;

    const filePath = path.resolve(__dirname, `../routes/methods.ts`);
    writeFileSync(filePath, routesTypeDef, 'utf-8');
}