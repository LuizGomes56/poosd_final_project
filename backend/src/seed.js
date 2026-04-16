import { TOPICS } from "./model/topics.ts";
import { QUESTIONS } from "./model/questions.ts";
import { USERS } from "./model/users.ts";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { Dotenv } from "./utils/env.ts";

const conn = await mongoose.connect(Dotenv.database_url);
console.log(`MongoDB connected: ${conn.connection.host}`);

async function seed() {
    await USERS.deleteMany({});
    await TOPICS.deleteMany({});
    await QUESTIONS.deleteMany({});

    const userAgg = await USERS.create({
        full_name: "Test User",
        email: "test@mail.com",
        password_hash: bcrypt.hashSync("123456", 10),
    });

    const user = userAgg.toObject();

    const mathTopicAgg = await TOPICS.create({
        name: "Mathematics",
        description: "Mathematics test topic",
        user_id: user._id,
    });

    const mathTopic = mathTopicAgg.toObject();

    const trigTopicAgg = await TOPICS.create({
        name: "Trigonometry",
        description: "Trigonometry test topic",
        user_id: user._id,
    });

    const trigTopic = trigTopicAgg.toObject();

    for (const body of [
        {
            type: "MCQ",
            prompt: "2 + 2 = ?",
            choice: {
                options: ["1", "2", "3", "4"],
                answers: {
                    single: "4"
                }
            },
        },
        {
            type: "MCQ",
            prompt: "Check all Geometric shapes",
            choice: {
                options: ["Circle", "Motorcycle", "Rectangle", "Triangle", "Bus", "Airplane"],
                answers: {
                    multiple: ["Circle", "Rectangle", "Triangle"]
                }
            },
        },
        {
            type: "FRQ",
            prompt: "What is the square root of 16?",
            frq: {
                kind: "NUMBER",
                accepted_numbers: [4],
                tolerance: 0.01
            },
        },
        {
            type: "FRQ",
            prompt: "What is the derivative of e^x?",
            frq: {
                kind: "TEXT",
                accepted_texts: ["itself", "e^x", "same", "e^{x}"],
            },
        },
        {
            type: "TF",
            prompt: "Does the integral from 0 to infinity of x diverge?",
            choice: {
                answers: {
                    single: "true"
                }
            }
        }
    ]) {
        await QUESTIONS.create({
            topic_ids: [mathTopic._id, trigTopic._id],
            user_id: user._id,
            difficulty: "EASY",
            ...body
        });
    }

    console.log("Seeded successfully");
}

await seed();