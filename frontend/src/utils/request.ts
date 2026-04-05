import { BACKEND_ROUTES, type SwaggerDocs } from "backend";

export async function api<
    P extends keyof SwaggerDocs,
    I extends SwaggerDocs[P]["input"]
>(path: P, ...input: I extends undefined ? [] : [I]) {
    const method = BACKEND_ROUTES[path];
    const URL = import.meta.env.API_URL || "http://localhost:3000/api";

    const route = `${URL}/${path}`;

    console.log("Calling route: ", route, "with method: ", method);

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

        console.log(args);

        const request = await fetch(route, args);
        const response = await request.json();
        return response as SwaggerDocs[P]["output"];
    } catch (e) {
        console.error(e);
        throw e;
    }
}

