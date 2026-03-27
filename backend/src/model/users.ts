import { Schema, model, type InferSchemaType } from "mongoose";
import { maxLength, minLength } from "zod";

const USERS_SCHEMA = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            maxLength: 256,
            index: true
        },
        password_hash: {
            type: String,
            required: true
        },
        email_verified: {
            type: Boolean,
            required: true,
            default: false
        },
        full_name: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 64
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

export const USERS = model("users", USERS_SCHEMA);

export type User = InferSchemaType<typeof USERS_SCHEMA>;