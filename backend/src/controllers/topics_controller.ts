import { TOPICS } from "../model/topics.js";
import type { Controller } from "../types.js";
import { HttpResponse } from "../utils/http.js";

export const TopicsController = {
    create: async function (req, res) {
        return HttpResponse.NotImplemented();
    },
    all: async function (req, res) {
        const data = await TOPICS.find().lean();

        return HttpResponse.Ok().body(data);
    }
} as const satisfies Controller["topics"]