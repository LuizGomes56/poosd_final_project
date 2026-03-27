import { BACKEND_ROUTES, type SwaggerDocs } from "../../../backend";

export async function api<
    P extends keyof SwaggerDocs,
    I extends SwaggerDocs[P]["input"],
    O extends SwaggerDocs[P]["output"]
>(path: P, ...input: I extends undefined ? [] : [I]): Promise<O> {
    const method = BACKEND_ROUTES[path];
    return 0 as any;
}