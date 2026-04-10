import { Schema, model } from "mongoose";

const AUTH_SCHEMA = new Schema(
    {
        email: {
            type: String,
            required: true,
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
        }
    },
    { timestamps: false }
);

export const AUTH = model("auth", AUTH_SCHEMA);