import { BACKEND_ROUTES, type SwaggerDocs } from "backend";

export async function api<
    P extends keyof SwaggerDocs,
    I extends SwaggerDocs[P]["input"]
>(path: P, ...input: I extends undefined ? [] : [I]) {
    const method = BACKEND_ROUTES[path];
    const URL = "http://localhost:3001/api";

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

        const request = await fetch(`${URL}/${path}`, args);
        const response = await request.json();
        return response as SwaggerDocs[P]["output"];
    } catch (e) {
        console.error(e);
        throw e;
    }
}

