import { Schema, model, type InferSchemaType } from "mongoose";

const QUESTIONS_SCHEMA = new Schema(
    {
        type: {
            type: String,
            enum: ["MCQ", "TF", "FRQ"],
            required: true
        },
        prompt: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            enum: ["EASY", "MEDIUM", "HARD"],
            required: true
        },
        topic_ids: {
            type: [Schema.Types.ObjectId],
            required: true,
            default: []
        },
        hint: {
            type: String,
            required: false,
        },
        explanation: {
            type: String,
            required: false
        },
        points: {
            type: Number,
            default: 100
        },
        choice_id: {
            type: Schema.Types.ObjectId,
            ref: "choice",
            required: false
        }
    },
    { timestamps: true }
);

export const QUESTIONS = model("questions", QUESTIONS_SCHEMA);

export type Questions = InferSchemaType<typeof QUESTIONS_SCHEMA>;