import { Schema, model, type InferSchemaType } from "mongoose";

const CHOICE_SCHEMA = new Schema({
    options: {
        type: [String],
        required: true,
        // validate: {
        //     validator: (arr: string[]) => arr.length > 0,
        //     message: "Options must not be empty"
        // }
    },
    answers: {
        single: {
            type: String,
            required: false
        },
        multiple: {
            type: [String],
            required: false
        }
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: "question",
        required: true
    }
});

export const CHOICE = model("choice", CHOICE_SCHEMA);

export type Choice = InferSchemaType<typeof CHOICE_SCHEMA>;