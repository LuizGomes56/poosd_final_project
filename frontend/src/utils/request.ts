import type { SwaggerDocs } from "../../../shared/swagger";
type TestSwagger = SwaggerDocs;

// export async function callAuth<
//     T extends keyof Routers["SvianetAuth"],
//     U extends App["SvianetAuth"]["Routes"][T],
//     V extends Routers["SvianetAuth"][T][number] | string & {},
//     W extends InputSchema["SvianetAuth"][T]
// >(
//     req: Request,
//     path: T,
//     method: V,
//     ...args: keyof W extends never ? [extra_headers?: APICallExtraHeaders] : [data: W, extra_headers?: APICallExtraHeaders]
// ): Promise<APIRules<U>["Response"]> {
//     let data = {} as any;
//     let extra_headers = {} as any;
//     if (args[0]) {
//         let match = false;
//         for (const key of Object.keys(args[0])) {
//             if (["body", "params", "query"].includes(key)) {
//                 match = true;
//                 break;
//             }
//         }
//         if (match) {
//             data = args[0];
//             if (args[1]) {
//                 extra_headers = args[1];
//             }
//         } else {
//             extra_headers = args[0];
//         }
//     }
//     let headers: HeadersInit & APICallExtraHeaders = {
//         "Content-Type": "application/json",
//         "Accept": "application/json",
//         "X_API_KEY": process.env.SVIANET_AUTH_API_KEY as string,
//         "Authorization": `Bearer ${req.session.token}`
//     };
//     if (extra_headers) {
//         for (const [key, value] of Object.entries(extra_headers)) {
//             headers[key] = value;
//         }
//     }
//     let url = `${process.env.SVIANET_AUTH_ENDPOINT}/api/${path}`;
//     let config: any = {
//         method,
//         headers
//     };
//     if (data) {
//         const body = data.body;
//         const params = data.params;
//         const query = data.query;
//         if (body) {
//             config.body = JSON.stringify(body);
//         }
//         if (params) {
//             url += `/${(Object.values(params) as any).map(encodeURIComponent).join("/")}`;
//         }
//         if (query) {
//             url += `?${new URLSearchParams(Object.fromEntries(
//                 Object.entries(query).filter(([_, v]) => v !== undefined)) as any
//             ).toString()}`;
//         }
//     }
//     const request = await fetch(url, config);
//     if (!request.ok) {
//         console.warn(`\x1b[31mError on NeedXpress FetchAuth<T> WHERE URL = ${path} ${request.status} ${request.statusText}\x1b[0m`);
//     }
//     let response: APIRules<U>["Response"];
//     try {
//         response = await request.json();
//     }
//     catch {
//         throw new Error("Request not return a JSON");
//     }
//     response.code = request.status;
//     return response;
// }
