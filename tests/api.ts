import { BACKEND_ROUTES, type SwaggerDocs } from "backend";

type InputArgs<I, S extends boolean> =
    I extends undefined
    ? S extends true
    ? [token?: string]
    : []
    : S extends true
    ? [input: I, token?: string]
    : [input: I];

export async function api<P extends keyof SwaggerDocs>(
    path: P,
    ...input: InputArgs<
        SwaggerDocs[P]["input"],
        SwaggerDocs[P]["protected"]
    >
): Promise<SwaggerDocs[P]["output"]> {
    const method = BACKEND_ROUTES[path];
    const URL = "http://localhost:3000/api";

    let payload: SwaggerDocs[P]["input"] | undefined;
    let token: string | undefined;

    if (input.length === 2) {
        payload = input[0] as SwaggerDocs[P]["input"];
        token = input[1];
    } else if (input.length === 1) {
        const first = input[0];

        if (typeof first === "string") {
            token = first;
        } else {
            payload = first as SwaggerDocs[P]["input"];
        }
    }

    try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const args: RequestInit = {
            method,
            headers,
            credentials: "include",
        };

        if (method !== "GET" && payload !== undefined) {
            args.body = JSON.stringify(payload);
        }

        const request = await fetch(`${URL}/${String(path)}`, args);
        const response = await request.json();

        return response as SwaggerDocs[P]["output"];
    } catch (e) {
        console.error(e);
        throw e;
    }
}