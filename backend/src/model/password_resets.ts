import { Schema, model } from "mongoose";

const PASSWORD_RESETS_SCHEMA = new Schema(
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
        }
    },
    { timestamps: false }
);

export const PASSWORD_RESETS = model("password_resets", PASSWORD_RESETS_SCHEMA);
