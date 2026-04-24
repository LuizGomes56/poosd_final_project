import { BACKEND_ROUTES, type SwaggerDocs } from "backend";

export async function api<
    P extends keyof SwaggerDocs,
    I extends SwaggerDocs[P]["input"]
>(path: P, ...input: I extends undefined ? [] : [I]) {
    const method = BACKEND_ROUTES[path];
    // const URL = "http://localhost:3000/api";
    const URL = import.meta.env.API_URL || "http://api.project.cop4331.cc/api";

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

        const token2 = response?.body?.token;
        if (token2 && typeof token2 === "string") {
            localStorage.setItem("token", token2);
        }

        return response as SwaggerDocs[P]["output"];
    } catch (e) {
        console.error("fn api::catch", e);
        throw e;
    }
}

