import { Dotenv } from "../index";
import type { Controller } from "../types";
import { HttpResponse } from "../utils/http";

export const QuestionsController = {
    create: async function (req, res) {
        return HttpResponse.NotImplemented();
    },
} as const satisfies Controller["questions"]