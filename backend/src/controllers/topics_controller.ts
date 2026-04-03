import { QUESTIONS } from "../model/questions.js";
import { TOPICS } from "../model/topics.js";
import type { Controller } from "../types.js";
import { HttpResponse } from "../utils/http.js";

export const TopicsController = {
    create: async function (req) {
        const { name, description } = req.body;
        const { user_id } = req.payload;
        const topic = await TOPICS.create({
            user_id,
            name,
            description
        });
        const body = topic.toObject();
        return HttpResponse.Ok().body({
            ...body,
            topic_id: body._id.toString()
        });
    },
    delete: async function (req) {
        const { topic_id } = req.body;
        const topic = await TOPICS.findByIdAndDelete(topic_id).lean();

        if (!topic) {
            return HttpResponse.NotFound().message("Topic not found");
        }

        return HttpResponse.Ok().body(topic);
    },
    /**
     * It just updates whatever was provided
     */
    update: async function (req) {
        const { topic_id, name, description } = req.body;

        const data = {} as Record<string, string>;

        if (name) {
            data.name = name;
        }

        if (description) {
            data.description = description;
        }

        const topic = await TOPICS.findByIdAndUpdate(
            topic_id,
            data,
            { new: true }
        ).lean();

        if (!topic) {
            return HttpResponse.NotFound().message("Topic not found");
        }

        return HttpResponse.Ok().body(topic);
    },
    all: async function (req) {
        const { user_id } = req.payload;
        const data = await TOPICS.find({
            user_id,
        }).lean();

        const result = await Promise.all(data.map(async v => {
            const topic_id = v._id.toString();
            const questions = await QUESTIONS.countDocuments({
                topic_ids: topic_id
            }).lean();

            return {
                topic_id,
                questions,
                ...v
            }
        }));

        return HttpResponse.Ok().body(result);
    }
} as const satisfies Controller["topics"]


// // Require mongoose module
// const mongoose = require("mongoose");

// // Set Up the Database connection
// const URI = "mongodb://localhost:27017/geeksforgeeks"

// const connectionObject = mongoose.createConnection(URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// const studentSchema = new mongoose.Schema({
//     name: { type: String },
//     age: { type: Number },
//     rollNumber: { type: Number },
// });

// const marksSchema = new mongoose.Schema({
//     english: Number,
//     maths: Number,
//     science: Number,
//     socialScience: Number,
//     hindi: Number,
//     rollNumber: Number
// })

// const Student = connectionObject.model('Student', studentSchema);

// const Mark = connectionObject.model('Mark', marksSchema);

// Student.aggregate().lookup({
//     from: 'marks',
//     localField: 'rollNumber', foreignField: 'rollNumber',
//     as: 'student_marks'
// }).exec((error, result) => {
//     if (error) {
//         console.log('error - ', error);

//     } else {
//         console.log('result - ', result[0]);
//     }
// }) https://stackoverflow.com/questions/34967482/lookup-on-objectids-in-an-array