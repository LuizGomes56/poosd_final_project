import { Schema, model, type InferSchemaType } from "mongoose";

const TOPICS_SCHEMA = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: false,
            default: ""
        },
        questions: {
            type: [Schema.Types.ObjectId],
            ref: "questions",
            default: []
        }
    },
    { timestamps: true }
);

export const TOPICS = model("topics", TOPICS_SCHEMA);

export type Topics = InferSchemaType<typeof TOPICS_SCHEMA>;
