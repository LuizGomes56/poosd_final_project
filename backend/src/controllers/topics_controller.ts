import { Dotenv } from "../index.js";
import type { Controller } from "../types.js";
import { HttpResponse } from "../utils/http.js";

export const TopicsController = {
    create: async function (req, res) {
        return HttpResponse.NotImplemented();
    }
} as const satisfies Controller["topics"]