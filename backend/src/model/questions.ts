import { Schema, model, type InferSchemaType } from "mongoose";

const CHOICE_SCHEMA = new Schema(
    {
        options: {
            type: [String],
            default: []
        },
        answers: {
            single: {
                type: String,
                default: undefined
            },
            multiple: {
                type: [String],
                default: undefined
            }
        }
    },
    { _id: false }
);

const FRQ_SCHEMA = new Schema(
    {
        kind: {
            type: String,
            enum: ["NUMBER", "TEXT"],
            required: true
        },
        accepted_numbers: {
            type: [Number],
            default: undefined
        },
        tolerance: {
            type: Number,
            default: 0,
            min: 0
        },
        accepted_texts: {
            type: [String],
            default: undefined
        }
    },
    { _id: false }
);

const QUESTIONS_SCHEMA = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true
        },
        type: {
            type: String,
            enum: ["MCQ", "TF", "FRQ"],
            required: true,
            index: true
        },
        prompt: {
            type: String,
            required: true,
            trim: true
        },
        difficulty: {
            type: String,
            enum: ["EASY", "MEDIUM", "HARD"],
            required: true
        },
        topic_ids: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "topics",
                    required: true
                }
            ],
            required: true,
            validate: {
                validator: (arr: unknown[]) => Array.isArray(arr) && arr.length > 0,
                message: "At least one topic is required"
            }
        },
        hint: {
            type: String,
            default: ""
        },
        explanation: {
            type: String,
            default: ""
        },
        points: {
            type: Number,
            default: 100,
            min: 0
        },
        choice: {
            type: CHOICE_SCHEMA,
            default: undefined
        },
        frq: {
            type: FRQ_SCHEMA,
            default: undefined
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        virtuals: {
            question_id: {
                get() {
                    return this._id.toString();
                }
            }
        }
    },
);

QUESTIONS_SCHEMA.pre("validate", function (next) {
    const { type, choice, frq } = this;

    if (type === "MCQ" || type === "TF") {
        if (!choice) {
            this.invalidate("choice", "Choice data is required for MCQ and TF");
            return next;
        }

        if (frq) {
            this.invalidate("frq", "MCQ and TF must not define FRQ data");
        }
    }

    if (type === "FRQ") {
        if (choice) {
            this.invalidate("choice", "FRQ questions must not have choice data");
        }

        if (!frq) {
            this.invalidate("frq", "FRQ data is required");
            return next;
        }

        if (frq.kind === "NUMBER") {
            const numbers = Array.isArray(frq.accepted_numbers) ? frq.accepted_numbers : [];

            if (numbers.length === 0) {
                this.invalidate(
                    "frq.accepted_numbers",
                    "FRQ NUMBER must define at least one accepted number"
                );
            }

            if (frq.accepted_texts?.length) {
                this.invalidate(
                    "frq.accepted_texts",
                    "FRQ NUMBER must not define accepted texts"
                );
            }
        }

        if (frq.kind === "TEXT") {
            const texts = Array.isArray(frq.accepted_texts) ? frq.accepted_texts : [];

            if (texts.length === 0) {
                this.invalidate(
                    "frq.accepted_texts",
                    "FRQ TEXT must define at least one accepted text"
                );
            }

            if (frq.accepted_numbers?.length) {
                this.invalidate(
                    "frq.accepted_numbers",
                    "FRQ TEXT must not define accepted numbers"
                );
            }
        }
    }

    return next;
});

QUESTIONS_SCHEMA.index({ user_id: 1, topic_ids: 1 });
QUESTIONS_SCHEMA.index({ user_id: 1, createdAt: -1 });

export const QUESTIONS = model("questions", QUESTIONS_SCHEMA);

export type Questions = InferSchemaType<typeof QUESTIONS_SCHEMA> & { question_id: string };
