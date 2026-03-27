import { SwaggerDocs } from "../routes/types";
export interface HttpResponse<T extends Record<string, any> = {}> {
    ok: boolean;
    status: HttpStatus;
    message?: string;
    body?: T;
}
export declare enum HttpStatus {
    Ok = 200,
    NotFound = 404,
    BadRequest = 400,
    InternalServerError = 500,
    Unauthorized = 401
}
/**
 * Export to frontend
 */
export declare function api<P extends keyof SwaggerDocs, M extends SwaggerDocs[P]["method"], I extends SwaggerDocs[P]["input"], O extends SwaggerDocs[P]["output"]>(path: P, method: M, input: I): Promise<O>;
export declare function getRouteMethods(express: any): void;
