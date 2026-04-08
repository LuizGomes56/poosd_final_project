import { Schema, model } from "mongoose";

const AUTH_SCHEMA = new Schema(
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
        code: {
            type: String,
            required: true
        },
        expires_in: {
            type: Number,
            required: true
        },
        full_name: {
            type: String,
            required: true,
            trim: true,
            minLength: 4,
            maxLength: 64
        }
    },
    { timestamps: false }
);

export const AUTH = model("users", AUTH_SCHEMA);