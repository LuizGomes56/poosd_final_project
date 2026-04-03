import { BACKEND_ROUTES, type SwaggerDocs } from "backend";

export async function api<
    P extends keyof SwaggerDocs,
    I extends SwaggerDocs[P]["input"],
    O extends SwaggerDocs[P]["output"]
>(path: P, ...input: I extends undefined ? [] : [I]): Promise<O> {
    const method = BACKEND_ROUTES[path];
    const URL = "http://localhost:3000/api";

    const route = `${URL}/${String(path)}`;

    try {
        const args: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        };

        const token = localStorage.getItem("token");
        if (token) {
            args.headers = {
                ...args.headers,
                Authorization: `Bearer ${token}`,
            };
        }

        if (method !== "GET") {
            args.body = JSON.stringify(input[0]);
        }

        const request = await fetch(route, args);
        const response = await request.json();
        return response as O;
    } catch (e) {
        const message = `Error calling after calling ${route}[${method}]: ${String(e)}`;
        console.error(message);
        throw new Error(message);
    }
}

