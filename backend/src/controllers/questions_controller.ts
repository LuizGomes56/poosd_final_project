import { QUESTIONS } from "../model/questions.js";
import { TOPICS } from "../model/topics.js";
import type { Controller } from "../types.js";
import { HttpResponse } from "../utils/http.js";

/**
 * Removes duplicate values from an array of strings
 * This is being used here to remove duplicated (if they exist eventually)
 * `topic_id`s or `question_id`s
 */
function dedup(ids: string[]) {
    return [...new Set(ids)];
}

/**
 * Verifies if that user indeed owns the topic that is being read or modified
 * This is a validation step that should run before any topic is read or modified
 */
async function assertTopicOwnership(topic_ids: string[], user_id: string) {
    const uniqueTopicIds = dedup(topic_ids);

    const count = await TOPICS.countDocuments({
        _id: { $in: uniqueTopicIds },
        user_id
    });

    return count === uniqueTopicIds.length;
}

export const QuestionsController = {
    create: async function (req) {
        const { user_id } = req.payload;
        const body = req.body;
        const {
            topic_ids,
            type,
            prompt,
            difficulty,
            hint,
            explanation,
            points
        } = body;

        if (!await assertTopicOwnership(topic_ids, user_id)) {
            return HttpResponse.NotFound()
                .message("One or more topics were not found for this user");
        }

        const question = await QUESTIONS.create({
            user_id,
            topic_ids: dedup(topic_ids),
            type,
            prompt,
            difficulty,
            hint: hint ?? "",
            explanation: explanation ?? "",
            points: points ?? 100,
            ...(type === "FRQ"
                ? { frq: body.frq }
                : { choice: body.choice })
        });

        const result = {
            question_id: question.question_id,
            ...question.toObject()
        };

        return HttpResponse.Ok().body(result);
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

        return HttpResponse.Ok().body(question);
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

        return HttpResponse.Ok().body(question);
    },
    update: async function (req) {
        const { user_id } = req.payload;
        const { question_id, ...body } = req.body;

        if (body.topic_ids) {
            const ownsAllTopics = await assertTopicOwnership(body.topic_ids, user_id);

            if (!ownsAllTopics) {
                return HttpResponse.NotFound()
                    .message("One or more topics were not found for this user");
            }

            body.topic_ids = dedup(body.topic_ids);
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

        return HttpResponse.Ok().body(question);
    },
    /**
     * Returns a list of all questions that a user has.
     * If `topic_id` is provided, we filter it to that specific topic
     * Return data is always ordered by createdAt desc. This is not a search function
     */
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

        return HttpResponse.Ok().body(data.map(v => ({
            question_id: v._id.toString(),
            ...v
        })));
    },
    check: async function (req) {
        const { user_id } = req.payload;
        const { question_id, answer } = req.body;

        // We don't ask for topic_id, so any user can verify the answer of any question

        const question = await QUESTIONS.findOne({
            _id: question_id,
            user_id
        }).lean();

        if (!question) {
            return HttpResponse.NotFound().message("Question not found");
        }

        const correct = (() => {
            if (question.type === "MCQ") {
                const single = question.choice?.answers?.single;
                const multiple = question.choice?.answers?.multiple;

                if (single) {
                    // If it is a single, deterministic answer, just compare the literal
                    // text inside
                    return typeof answer === "string" && answer === single;
                }

                // For multiple answers we have find if all provided answers match the expected
                if (Array.isArray(multiple)) {
                    // If it we have multiple expected answers, we should also have multiple answers provided
                    if (!Array.isArray(answer)) {
                        throw new Error("This MCQ answer requires multiple answers");
                    };

                    // Sorting them will ensure they're the correct order
                    const expected = [...multiple].sort();
                    const received = [...answer].sort();

                    // Both arrays should have the same length if the answers are correct
                    if (expected.length !== received.length) {
                        return false
                    };

                    // Check every element inside expected, and check if it matches the received ones
                    return expected.every((value, i) => value === received[i]);
                }

                // If it didn't return true at this point, the answer is incorrect
                return false;
            }

            if (question.type === "TF") {
                const expected = question.choice?.answers?.single;

                // If no expected result is provided in the question's schema (Should be illegal)
                // we just fallback to false (All answers will always be wrong)
                if (!expected) {
                    return false
                };

                // Boolean("false") is not false so we have to treat it
                return (expected === "true" ? true : false) === answer;
            }

            if (question.type === "FRQ") {
                if (!question.frq) return false;

                // FRQ of type Number (We expect to see a simple numeric answer then)
                if (question.frq.kind === "NUMBER") {
                    // Here typeof answer should always be number, but we fallback to Number()
                    // which if exists will likely be NaN which always generates "false"
                    const value = typeof answer === "number" ? answer : Number(answer);

                    // Deny NaN values and Infinity (both positive and negative)
                    // If we use infinity, the answer should be a LaTeX input, not numeric
                    if (!Number.isFinite(value)) {
                        return false;
                    }

                    const accepted = question.frq.accepted_numbers ?? [];
                    const tolerance = question.frq.tolerance ?? 0;

                    // Check if the tolerance is in range. Note that it is not a percentage value,
                    // but rather the exact number.
                    // If the answer is 100, and tolerance = 50, then if the user inputs 50, it is correct.
                    // Plan the tolerance accordingly, and defaults to zero if not defined
                    return accepted.some((target) => Math.abs(target - value) <= tolerance);
                }

                if (question.frq.kind === "TEXT") {
                    // We can accept multiple texts. Lets say the answer is "Yes",
                    // we can accept "yes", "y" as well for example, so if any
                    // value in the accepted array matches the answer, then it is correct
                    const accepted = (question.frq.accepted_texts ?? []);

                    // At this point `answer` should be a string
                    // #[cold_path]
                    if (typeof answer !== "string") {
                        return false;
                    }

                    return accepted.includes(answer);
                }
            }

            // Fallback
            return false;
        })();

        return HttpResponse.Ok().body({
            correct,
            question_id
        });
    }
} as const satisfies Controller["questions"];