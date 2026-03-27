export interface HttpResponse<T extends Record<string, any> = {}> {
    ok: boolean;
    status: number;
    message?: string;
    body: T;
}
