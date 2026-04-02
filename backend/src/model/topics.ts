import { Schema, model, type InferSchemaType } from "mongoose";

const TOPICS_SCHEMA = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxLength: 120
        },
        description: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

TOPICS_SCHEMA.index({ user_id: 1, name: 1 }, { unique: true });

export const TOPICS = model("topics", TOPICS_SCHEMA);

export type Topics = InferSchemaType<typeof TOPICS_SCHEMA>;