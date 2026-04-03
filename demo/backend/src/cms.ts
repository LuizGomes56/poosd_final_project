import type { CmsQuestion, CmsResponse, CmsTopic } from "./types.js";

let cachedToken: string | null = null;

function getConfig() {
    const baseUrl = (process.env.CMS_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
    const email = process.env.CMS_EMAIL;
    const password = process.env.CMS_PASSWORD;

    if (!email || !password) {
        throw new Error("CMS_EMAIL and CMS_PASSWORD must be configured for the demo backend");
    }

    return { baseUrl, email, password };
}

async function cmsFetch<T>(
    path: string,
    init: RequestInit,
    includeAuth = true,
    allowRetry = true
) {
    const { baseUrl } = getConfig();
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "application/json");

    if (includeAuth) {
        const token = await getCmsToken();
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${baseUrl}/api/${path}`, {
        ...init,
        headers
    });

    const json = await response.json() as CmsResponse<T>;

    if (response.status === 401 && includeAuth && allowRetry) {
        cachedToken = null;
        return cmsFetch<T>(path, init, includeAuth, false);
    }

    if (!json.ok) {
        throw new Error(json.message || `CMS request failed for ${path}`);
    }

    return json.body as T;
}

export async function getCmsToken() {
    if (cachedToken) {
        return cachedToken;
    }

    const { baseUrl, email, password } = getConfig();

    const response = await fetch(`${baseUrl}/api/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const json = await response.json() as CmsResponse<{ token: string }>;

    if (!json.ok || !json.body?.token) {
        throw new Error(json.message || "Failed to log into the CMS demo account");
    }

    cachedToken = json.body.token;
    return cachedToken;
}

export async function getTopics() {
    return cmsFetch<CmsTopic[]>("topics/all", {
        method: "GET"
    });
}

export async function getQuestions() {
    return cmsFetch<CmsQuestion[]>("questions/all", {
        method: "POST",
        body: JSON.stringify({})
    });
}

export async function getQuestion(questionId: string) {
    return cmsFetch<CmsQuestion>("questions/get", {
        method: "POST",
        body: JSON.stringify({
            question_id: questionId
        })
    });
}
