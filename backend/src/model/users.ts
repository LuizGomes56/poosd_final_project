import { type InferSchemaType, Schema, model } from "mongoose";

const USERS_SCHEMA = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
            lowercase: true,
            maxLength: 256
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
            trim: true,
            minLength: 4,
            maxLength: 64
        }
    },
    { timestamps: true }
);

export type User = InferSchemaType<typeof USERS_SCHEMA>;
export const USERS = model("users", USERS_SCHEMA);