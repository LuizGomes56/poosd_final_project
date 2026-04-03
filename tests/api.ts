import { BACKEND_ROUTES, type SwaggerDocs } from "backend";

class Token {
    token: string | undefined;

    set(value: string | undefined) {
        this.token = value;
    }

    get() {
        return this.token;
    }

    drop() {
        this.token = undefined;
    }
}

export const token = new Token();

export async function api<P extends keyof SwaggerDocs, I extends SwaggerDocs[P]["input"]>(
    path: P,
    ...input: I extends undefined ? [] : [I]
): Promise<SwaggerDocs[P]["output"]> {
    const method = BACKEND_ROUTES[path];
    const URL = "http://localhost:3000/api";

    const route = `${URL}/${String(path)}`;

    if (!method) {
        throw new Error(`No request method found for route ${route}`);
    }

    try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        const authorization = token.get();
        if (authorization) {
            headers.Authorization = `Bearer ${authorization}`;
        }

        const args: RequestInit = {
            method,
            headers,
            credentials: "include",
        };

        if (method !== "GET" && input.length) {
            args.body = JSON.stringify(input[0]);
        }

        const request = await fetch(route, args);
        const response = await request.json();

        return response as SwaggerDocs[P]["output"];
    } catch (e) {
        throw new Error(`Error calling after calling ${route}[${method}]: ${String(e)}`);
    }
}