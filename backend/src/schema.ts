import { z } from "zod";
import type { Route } from "./types.js";

const S = z.object({
    OBJECT_ID: z.string().max(24, { error: "Object ID must be at most 24 characters long" }),
    UUID: z.uuid({ error: (e) => `Invalid UUID: ${e.message}` }),
    JWT: z.jwt({ error: "Invalid JWT Token" }),
    NAME: z.string()
        .min(4, { error: "Name must be at least 4 characters long" })
        .max(64, { error: "Name must be at most 64 characters long" }),
    EMAIL: z.email({ error: "Invalid email" }),
    PASSWORD: z.string().min(4).max(32).describe("Password must be a string and be defined."),
    NOTHING: z.object({}),
    DESCRIPTION: z.string().max(256, { error: "Description must be at most 256 characters long" }),
    QUESTION_TYPE: z.enum(["MCQ", "TF", "FRQ"]),
    DIFFICULTY: z.enum(["EASY", "MEDIUM", "HARD"]),
    NON_EMPTY_STRING: z.string().trim().min(1, { error: "Field cannot be empty" }),
    STRING_ARRAY: z.array(z.string().trim().min(1)).min(1),
    TOPIC_IDS: z.array(z.string().length(24)).min(1, { error: "At least one topic is required" }),
}).shape;

const MCQChoiceSchema = z.object({
    options: z.array(z.string().trim().min(1)).min(1, {
        error: "MCQ questions must contain at least one option"
    }),
    answers: z.object({
        single: z.string().trim().min(1).optional(),
        multiple: z.array(z.string().trim().min(1)).min(1).optional()
    }).refine(
        (data) => {
            const hasSingle = data.single !== undefined;
            const hasMultiple = data.multiple !== undefined;
            return hasSingle !== hasMultiple;
        },
        {
            message: "Define exactly one of answers.single or answers.multiple",
            path: ["single"]
        }
    )
});

const TFChoiceSchema = z.object({
    answers: z.object({
        single: z.enum(["True", "False"])
    })
});

const FRQNumberSchema = z.object({
    kind: z.literal("NUMBER"),
    accepted_numbers: z.array(z.number()).min(1, {
        error: "FRQ NUMBER must define at least one accepted number"
    }),
    tolerance: z.number().min(0).default(0).optional()
});

const FRQTextSchema = z.object({
    kind: z.literal("TEXT"),
    accepted_texts: z.array(z.string().trim().min(1)).min(1, {
        error: "FRQ TEXT must define at least one accepted text"
    })
});

const FRQSchema = z.discriminatedUnion("kind", [
    FRQNumberSchema,
    FRQTextSchema
]);

const QuestionBaseSchema = z.object({
    topic_ids: S.TOPIC_IDS,
    prompt: z.string().trim().min(1).max(5000),
    difficulty: S.DIFFICULTY,
    hint: z.string().max(2000).optional(),
    explanation: z.string().max(10000).optional(),
    points: z.number().min(0).optional()
});

export const SCHEMA = {
    "users/login": z.object({
        email: S.EMAIL,
        password: S.PASSWORD,
    }),
    "users/logout": S.NOTHING,
    "users/register": z.object({
        full_name: S.NAME,
        email: S.EMAIL,
        password: S.PASSWORD,
    }),
    "users/patch": z.record(z.string(), z.any()),
    "users/verify": S.NOTHING,
    "users/dashboard": S.NOTHING,
    "users/send_email_verification": S.NOTHING,
    "users/verify_email": z.object({
        code: z.string().length(6)
    }),
    "users/forgot_password": z.object({
        email: S.EMAIL
    }),
    "users/reset_password": z.object({
        code: z.string().regex(/^\d{6}$/, {
            error: "Reset code must be exactly 6 digits"
        }),
        password: S.PASSWORD
    }),
    "questions/create": z.discriminatedUnion("type", [
        QuestionBaseSchema.extend({
            type: z.literal("MCQ"),
            choice: MCQChoiceSchema,
        }),
        QuestionBaseSchema.extend({
            type: z.literal("TF"),
            choice: TFChoiceSchema,
        }),
        QuestionBaseSchema.extend({
            type: z.literal("FRQ"),
            frq: FRQSchema,
        })
    ]),
    "questions/all": z.object({
        topic_id: S.OBJECT_ID.optional()
    }),
    "questions/search": z.object({
        query: S.NON_EMPTY_STRING.max(120),
        topic_id: S.OBJECT_ID.optional()
    }),
    "questions/get": z.object({
        question_id: S.OBJECT_ID
    }),
    "questions/delete": z.object({
        question_id: S.OBJECT_ID
    }),
    "questions/update": z.object({
        question_id: S.OBJECT_ID,
        topic_ids: S.TOPIC_IDS.optional(),
        type: S.QUESTION_TYPE.optional(),
        prompt: z.string().trim().min(1).max(5000).optional(),
        difficulty: S.DIFFICULTY.optional(),
        hint: z.string().max(2000).optional(),
        explanation: z.string().max(10000).optional(),
        points: z.number().min(0).optional(),
        choice: z.union([MCQChoiceSchema, TFChoiceSchema]).optional(),
        frq: FRQSchema.optional()
    }).superRefine((data, ctx) => {
        const changedSomething = data.topic_ids !== undefined
            || data.type !== undefined
            || data.prompt !== undefined
            || data.difficulty !== undefined
            || data.hint !== undefined
            || data.explanation !== undefined
            || data.points !== undefined
            || data.choice !== undefined
            || data.frq !== undefined;

        if (!changedSomething) {
            ctx.addIssue({
                code: "custom",
                message: "At least one field must be provided for update",
                path: ["question_id"]
            });
        }

        if (data.type === "FRQ" && data.choice !== undefined) {
            ctx.addIssue({
                code: "custom",
                message: "FRQ questions must not define choice",
                path: ["choice"]
            });
        }

        if ((data.type === "MCQ" || data.type === "TF") && data.frq !== undefined) {
            ctx.addIssue({
                code: "custom",
                message: "MCQ and TF questions must not define frq",
                path: ["frq"]
            });
        }

        if (data.type === "FRQ" && data.frq === undefined) {
            ctx.addIssue({
                code: "custom",
                message: "FRQ updates that change type must define frq",
                path: ["frq"]
            });
        }

        if ((data.type === "MCQ" || data.type === "TF") && data.choice === undefined) {
            ctx.addIssue({
                code: "custom",
                message: "MCQ and TF updates that change type must define choice",
                path: ["choice"]
            });
        }
    }),
    "questions/check": z.object({
        question_id: S.OBJECT_ID,
        answer: z.union([
            z.string(),
            z.number(),
            z.boolean(),
            z.array(z.string())
        ])
    }),
    "topics/create": z.object({
        name: S.NAME,
        description: S.DESCRIPTION.optional(),
    }),
    "topics/all": S.NOTHING,
    "topics/search": z.object({
        query: S.NON_EMPTY_STRING.max(120)
    }),
    "topics/delete": z.object({
        topic_id: S.OBJECT_ID
    }),
    "topics/update": z.object({
        topic_id: S.OBJECT_ID,
        name: S.NAME.optional(),
        description: S.DESCRIPTION.optional(),
    }).refine(
        (data) => data.name !== undefined || data.description !== undefined,
        {
            message: "At least one of \"name\" or \"description\" must be provided",
            path: ["name"],
        }
    )
} as const satisfies Record<(string & {}) | Route, Record<string, any>>;

export type InputSchema = {
    [K in keyof typeof SCHEMA]: z.infer<typeof SCHEMA[K]>
};
