import { Questions, QUESTIONS } from "../model/questions.js";
import { TOPICS } from "../model/topics.js";
import type { Controller } from "../types.js";
import { HttpResponse } from "../utils/http.js";

// This function will be inlined soon
function serializeQuestion(question: Questions) {
    return {
        ...question,
        topic_ids: Array.isArray(question.topic_ids)
            ? question.topic_ids.map((id) => id?.toString?.() ?? String(id))
            : []
    };
}

// I think I'll assume all strings are normalized (lower case + no trailing whitespaces)
function normalizeString(value: unknown) {
    return String(value).trim().toLowerCase();
}

// [Later] Inline
function uniqueIds(ids: string[]) {
    return [...new Set(ids)];
}

// Move this function to a service (I'll do it next time)
async function validateTopicOwnership(topic_ids: string[], user_id: string) {
    const uniqueTopicIds = uniqueIds(topic_ids);

    const count = await TOPICS.countDocuments({
        _id: { $in: uniqueTopicIds },
        user_id
    });

    return count === uniqueTopicIds.length;
}

export const QuestionsController = {
    create: async function (req) {
        const { user_id } = req.payload;
        const {
            topic_ids,
            type,
            prompt,
            difficulty,
            hint,
            explanation,
            points,
            choice,
            frq
        } = req.body as any;

        const ownsAllTopics = await validateTopicOwnership(topic_ids, user_id);

        if (!ownsAllTopics) {
            return HttpResponse.NotFound()
                .message("One or more topics were not found for this user");
        }

        const question = await QUESTIONS.create({
            user_id,
            topic_ids: uniqueIds(topic_ids),
            type,
            prompt,
            difficulty,
            hint: hint ?? "",
            explanation: explanation ?? "",
            points: points ?? 100,
            ...(choice ? { choice } : {}),
            ...(frq ? { frq } : {})
        });

        const body = serializeQuestion(question.toObject() as any);

        return HttpResponse.Ok().body(body);
    },
    get: async function (req) {
        const { user_id } = req.payload;
        const { question_id } = req.body;

        const question = await QUESTIONS.findOne({
            _id: question_id,
            user_id
        }).lean();

        if (!question) {
            return HttpResponse.NotFound().message("Question not found");
        }

        return HttpResponse.Ok().body(serializeQuestion(question as any));
    },
    delete: async function (req) {
        const { user_id } = req.payload;
        const { question_id } = req.body;

        const question = await QUESTIONS.findOneAndDelete({
            _id: question_id,
            user_id
        }).lean();

        if (!question) {
            return HttpResponse.NotFound().message("Question not found");
        }

        return HttpResponse.Ok().body(serializeQuestion(question as any));
    },
    update: async function (req) {
        const { user_id } = req.payload;
        const { question_id, ...body } = req.body;

        if (body.topic_ids) {
            const ownsAllTopics = await validateTopicOwnership(body.topic_ids, user_id);

            if (!ownsAllTopics) {
                return HttpResponse.NotFound()
                    .message("One or more topics were not found for this user");
            }

            body.topic_ids = uniqueIds(body.topic_ids);
        }

        const $set: Record<string, any> = {};
        const $unset: Record<string, any> = {};

        for (const [key, value] of Object.entries(body)) {
            if (value !== undefined) {
                $set[key] = value;
            }
        }

        if (body.type === "FRQ") {
            $unset.choice = 1;
        }

        if (body.type === "MCQ" || body.type === "TF") {
            $unset.frq = 1;
        }

        if (body.choice !== undefined) {
            $unset.frq = 1;
        }

        if (body.frq !== undefined) {
            $unset.choice = 1;
        }

        const update: Record<string, any> = {};
        if (Object.keys($set).length > 0) {
            update.$set = $set;
        }
        if (Object.keys($unset).length > 0) {
            update.$unset = $unset;
        }

        const question = await QUESTIONS.findOneAndUpdate(
            {
                _id: question_id,
                user_id
            },
            update,
            {
                new: true,
                runValidators: true
            }
        ).lean();

        if (!question) {
            return HttpResponse.NotFound().message("Question not found");
        }

        return HttpResponse.Ok().body(serializeQuestion(question as any));
    },
    all: async function (req) {
        const { user_id } = req.payload;
        const { topic_id } = req.body;

        const filter: Record<string, any> = { user_id };

        if (topic_id) {
            filter.topic_ids = topic_id;
        }

        const data = await QUESTIONS.find(filter)
            .sort({ createdAt: -1 })
            .lean();

        return HttpResponse.Ok().body(data.map(serializeQuestion as any));
    },
    check: async function (req) {
        const { user_id } = req.payload;
        const { question_id, answer } = req.body;

        const question = await QUESTIONS.findOne({
            _id: question_id,
            user_id
        }).lean<Questions | null>();

        if (!question) {
            return HttpResponse.NotFound().message("Question not found");
        }

        const correct = (() => {
            if (question.type === "MCQ") {
                const single = question.choice?.answers?.single;
                const multiple = question.choice?.answers?.multiple;

                if (single !== undefined) {
                    return typeof answer === "string" && answer === single;
                }

                if (Array.isArray(multiple)) {
                    if (!Array.isArray(answer)) return false;

                    const expected = [...multiple].sort();
                    const received = [...answer].sort();

                    if (expected.length !== received.length) return false;

                    return expected.every((value, index) => value === received[index]);
                }

                return false;
            }

            if (question.type === "TF") {
                const expected = question.choice?.answers?.single;

                if (expected === undefined) return false;

                if (typeof answer === "boolean") {
                    return expected === (answer ? "True" : "False");
                }

                if (typeof answer === "string") {
                    const normalized = normalizeString(answer);
                    const mapped =
                        normalized === "true" ? "True" :
                            normalized === "false" ? "False" :
                                answer;

                    return mapped === expected;
                }

                return false;
            }

            if (question.type === "FRQ") {
                if (!question.frq) return false;

                if (question.frq.kind === "NUMBER") {
                    const value = typeof answer === "number" ? answer : Number(answer);

                    if (!Number.isFinite(value)) {
                        return false;
                    }

                    const accepted = question.frq.accepted_numbers ?? [];
                    const tolerance = question.frq.tolerance ?? 0;

                    return accepted.some((target) => Math.abs(target - value) <= tolerance);
                }

                if (question.frq.kind === "TEXT") {
                    const value = normalizeString(answer);
                    const accepted = (question.frq.accepted_texts ?? []).map(normalizeString);
                    return accepted.includes(value);
                }
            }

            return false;
        })();

        return HttpResponse.Ok().body({
            correct,
            question_id
        });
    }
} as const satisfies Controller["questions"];