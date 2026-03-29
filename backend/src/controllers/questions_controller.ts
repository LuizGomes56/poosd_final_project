import type { Controller } from "../types.js";
import { HttpResponse } from "../utils/http.js";

export const QuestionsController = {
    create: async function (req, res) {
        return HttpResponse.NotImplemented();
    },
} as const satisfies Controller["questions"]