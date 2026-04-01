import { TOPICS } from "../model/topics.js";
import type { Controller } from "../types.js";
import { HttpResponse } from "../utils/http.js";

export const TopicsController = {
    create: async function (req) {
        const { name, description } = req.body;
        const { user_id } = req.payload;
        const topic = await TOPICS.create({
            user_id,
            name,
            description
        });
        const body = topic.toObject();
        return HttpResponse.Ok().body(body);
    },
    delete: async function (req) {
        const { topic_id } = req.body;
        const topic = await TOPICS.findByIdAndDelete(topic_id).lean();

        if (!topic) {
            return HttpResponse.NotFound().message("Topic not found");
        }

        return HttpResponse.Ok().body(topic);
    },
    all: async function (req) {
        const { user_id } = req.payload;
        const data = await TOPICS.find({
            user_id
        }).lean();

        return HttpResponse.Ok().body(data);
    }
} as const satisfies Controller["topics"]