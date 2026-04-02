import { useState } from "react";
import { Link } from "react-router-dom";
import Checkbox from "../components/Checkbox";
import Button from "../components/Button";
import ColoredButton from "../components/ColoredButton";

export default function NewQuestion() {
    const [type, setType] = useState("FRQ");
    const [tfAnswer, setTfAnswer] = useState(true);
    const [_selectedTopic, setSelectedTopic] = useState("");
    const [choices, setChoices] = useState(["", "", "", ""]);
    const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);
    // const correctAnswers = checkedIndexes.map(i => choices[i]);

    const topics = [
        { _id: "1", name: "Math" },
        { _id: "2", name: "Physics" },
        { _id: "3", name: "Chemistry" },
    ];

    // TODO: replace when backend is ready
    /*
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const data = await api("topics/all");
                setTopics(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTopics();
    }, []);
    */
   
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
                        {(["MCQ", "FRQ", "TF"] as const).map((t) => (
                            <ColoredButton
                                key={t}
                                color="purple"
                                onClick={() => setType(t)}
                                className={type === t ? "opacity-100" : "opacity-50"}
                            >
                                {t === "MCQ" ? "Multiple Choice" : t === "FRQ" ? "Short Answer" : "True / False"}
                            </ColoredButton>
                        ))}
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

                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-2 text-white text-sm">
                            <input
                                type="radio"
                                name="tfAnswer"
                                checked={tfAnswer === true}
                                onChange={() => setTfAnswer(true)}
                            />
                            True
                        </label>
                        <label className="flex items-center gap-2 text-white text-sm">
                            <input
                                type="radio"
                                name="tfAnswer"
                                checked={tfAnswer === false}
                                onChange={() => setTfAnswer(false)}
                            />
                            False
                        </label>
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
                    <Checkbox
                        onEvent={() => {
                            setCheckedIndexes(prev =>
                                prev.includes(index)
                                    ? prev.filter(i => i !== index)
                                    : [...prev, index]
                            )
                        }}
                        enabled={checkedIndexes.includes(index)}
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
                <Button text="Save Question" onClick={() => {}} />

                <Link to="/" className="border border-zinc-700 text-zinc-400 text-sm px-4 py-2 rounded-lg">
                    Cancel
                </Link>
            </div>
        </div>
    );
}
