import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/request";

export default function NewQuestion() {
    const [type, setType] = useState("FRQ");
    const [tfAnswer, setTfAnswer] = useState(true);
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState("");
    const [choices, setChoices] = useState(["", "", "", ""]);
    const [correctIndex, setCorrectIndex] = useState<number | null>(null);

    useEffect(() => {
    api("topics")
        .then((data) => setTopics(data))
        .catch((err) => console.error(err));
    }, []); 

    return (
        <div className="p-6">
            {/* header */}
            <div className="mb-6">
                <p className="text-zinc-600 text-xs mb-1">
                    dashboard / questions / new
                </p>
                <h1 className="text-white text-2xl font-bold">
                    New Question
                </h1>
            </div>

            {/* route label */}
            <div className="mb-6">
                <span className="text-green-400 text-xs bg-green-400/10 px-3 py-1 rounded-md font-mono">
                    ROUTE /dashboard/questions/new
                </span>
            </div>

            {/*  question details  */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
                <h2 className="text-white text-sm font-semibold mb-4">
                    Question Details
                </h2>

                {/* question text */}
                <div className="mb-4">
                    <label className="text-zinc-400 text-xs block mb-1">
                        Question Text
                    </label>
                    <textarea
                        placeholder="Enter your question here..."
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-white"
                    />
                </div>

                {/* topic & difficulty */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-zinc-400 text-xs block mb-1">
                            Topic
                        </label>
                        <select
                            onChange={(e) => setSelectedTopic(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white">
                            <option value="">Select topic...</option>
                            {topics.map((topic: any) => (
                                <option key={topic._id} value={topic._id}>
                                    {topic.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-zinc-400 text-xs block mb-1">
                            Difficulty
                        </label>
                        <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white">
                            <option value="">Select difficulty...</option>
                            <option value="EASY">Easy</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HARD">Hard</option>
                        </select>
                    </div>
                </div>

                {/* question type */}
                <div>
                    <label className="text-zinc-400 text-xs block mb-2">
                        Question Type
                    </label>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setType("MCQ")}
                            className={`flex-1 border rounded-lg py-2 text-xs ${
                                type === "MCQ"
                                    ? "border-green-500 text-green-400"
                                    : "border-zinc-700 text-white"
                            }`}
                        >
                            Multiple Choice
                        </button>

                        <button
                            onClick={() => setType("FRQ")}
                            className={`flex-1 border rounded-lg py-2 text-xs ${
                                type === "FRQ"
                                    ? "border-green-500 text-green-400"
                                    : "border-zinc-700 text-white"
                            }`}
                        >
                            Short Answer
                        </button>

                        <button
                            onClick={() => setType("TF")}
                            className={`flex-1 border rounded-lg py-2 text-xs ${
                                type === "TF"
                                    ? "border-green-500 text-green-400"
                                    : "border-zinc-700 text-white"
                            }`}
                        >
                            True / False
                        </button>
                    </div>
                </div>
            </div>

            {/* field based on question type */}

            {type === "FRQ" && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
                    <h2 className="text-white text-sm font-semibold mb-4">
                        Model Answer
                    </h2>

                    <textarea
                        placeholder="Enter expected answer for grading reference..."
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-white"
                    />
                </div>
            )}

            {type === "TF" && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
                    <h2 className="text-white text-sm font-semibold mb-4">
                        Correct Answer
                    </h2>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setTfAnswer(true)}
                            className={`flex-1 rounded-lg py-6 border ${
                                tfAnswer
                                    ? "border-green-500 bg-green-500/10 text-green-400"
                                    : "border-zinc-700 text-white"
                            }`}
                        >
                            ✔ True
                        </button>

                        <button
                            onClick={() => setTfAnswer(false)}
                            className={`flex-1 rounded-lg py-6 border ${
                                !tfAnswer
                                    ? "border-green-500 bg-green-500/10 text-green-400"
                                    : "border-zinc-700 text-red-400"
                            }`}
                        >
                            ✖ False
                        </button>
                    </div>
                </div>
            )}

            {type === "MCQ" && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
                    <h2 className="text-white text-sm font-semibold mb-4">
                        Choices
                    </h2>

                        {["A", "B", "C", "D"].map((label, index) => (
                <div key={label} className="flex items-center gap-2 mb-2">
                    {/* select correct option */}
                    <input
                        type="radio"
                        name="correct"
                        onChange={() => setCorrectIndex(index)}
                    />

                    {/* options */}
                    <input
                        value={choices[index]}
                        onChange={(e) => {
                            const newChoices = [...choices];
                            newChoices[index] = e.target.value;
                            setChoices(newChoices);
                        }}
                        placeholder={`Option ${label}`}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white"
                    />
                </div>
                ))}
        </div>
        )}

            {/* buttons */}
            <div className="flex gap-3">
                <button className="bg-green-500 hover:bg-green-600 text-black font-semibold text-sm px-4 py-2 rounded-lg">
                    Save Question
                </button>

                <Link
                    to="/dashboard/questions"
                    className="border border-zinc-700 text-zinc-400 text-sm px-4 py-2 rounded-lg"
                >
                    Cancel
                </Link>
            </div>
        </div>
    );
}
