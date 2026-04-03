import { useEffect, useState } from "react";
import type { ApiEnvelope, CheckResponse, DemoQuestion, DemoQuiz } from "./types.ts";

type SubmissionMap = Record<string, boolean>;

const emptyQuiz: DemoQuiz = {
    title: "Quiz",
    subtitle: "",
    topics: [],
    questions: []
};

function difficultyLabel(value: DemoQuestion["difficulty"]) {
    if (value === "EASY") return "Easy";
    if (value === "MEDIUM") return "Medium";
    return "Hard";
}

function difficultyColor(value: DemoQuestion["difficulty"]) {
    if (value === "EASY") return "bg-green-500/20 text-green-400";
    if (value === "MEDIUM") return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
}

function toAnswerPayload(question: DemoQuestion, single: string, multiple: string[], text: string) {
    if (question.answerMode === "multiple") {
        return multiple;
    }
    return text || single;
}

export default function App() {
    const [quiz, setQuiz] = useState<DemoQuiz>(emptyQuiz);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedTopicId, setSelectedTopicId] = useState("all");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [singleAnswer, setSingleAnswer] = useState("");
    const [multipleAnswer, setMultipleAnswer] = useState<string[]>([]);
    const [textAnswer, setTextAnswer] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<CheckResponse | null>(null);
    const [submissions, setSubmissions] = useState<SubmissionMap>({});

    useEffect(() => {
        void loadQuiz();
    }, []);

    async function loadQuiz() {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/quiz");
            const data = await response.json() as ApiEnvelope<DemoQuiz>;

            if (!data.ok || !data.body) {
                throw new Error(data.message || "Unable to load quiz data");
            }

            setQuiz(data.body);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : String(loadError));
        } finally {
            setLoading(false);
        }
    }

    const filteredQuestions = selectedTopicId === "all"
        ? quiz.questions
        : quiz.questions.filter((question) => question.topicIds.includes(selectedTopicId));

    const currentQuestion = filteredQuestions[currentIndex] ?? null;
    const answeredCount = Object.keys(submissions).length;
    const correctCount = Object.values(submissions).filter(Boolean).length;

    useEffect(() => {
        setCurrentIndex(0);
        resetComposer();
    }, [selectedTopicId]);

    function resetComposer() {
        setSingleAnswer("");
        setMultipleAnswer([]);
        setTextAnswer("");
        setFeedback(null);
    }

    function goToQuestion(index: number) {
        setCurrentIndex(index);
        resetComposer();
    }

    function toggleMultiOption(option: string) {
        setMultipleAnswer((current) => {
            return current.includes(option)
                ? current.filter((value) => value !== option)
                : [...current, option];
        });
    }

    async function submitAnswer() {
        if (!currentQuestion) {
            return;
        }

        setSubmitting(true);
        setFeedback(null);

        try {
            const response = await fetch("/api/check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    questionId: currentQuestion.questionId,
                    answer: toAnswerPayload(currentQuestion, singleAnswer, multipleAnswer, textAnswer)
                })
            });

            const data = await response.json() as ApiEnvelope<CheckResponse>;

            if (!data.ok || !data.body) {
                throw new Error(data.message || "Unable to check answer");
            }

            setFeedback(data.body);
            setSubmissions((current) => ({
                ...current,
                [currentQuestion.questionId]: data.body!.correct
            }));
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : String(submitError));
        } finally {
            setSubmitting(false);
        }
    }

    const canSubmit = (() => {
        if (!currentQuestion) {
            return false;
        }

        if (currentQuestion.answerMode === "multiple") {
            return multipleAnswer.length > 0;
        }

        if (currentQuestion.answerMode === "number" || currentQuestion.answerMode === "text") {
            return textAnswer.trim().length > 0;
        }

        return singleAnswer.length > 0;
    })();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-zinc-400 text-lg">Loading quiz...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 text-lg mb-4">{error}</p>
                    <button
                        type="button"
                        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition"
                        onClick={() => void loadQuiz()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{quiz.title}</h1>
                    {quiz.subtitle && <p className="text-zinc-400">{quiz.subtitle}</p>}
                    <div className="flex gap-4 mt-4 text-sm">
                        <span className="text-zinc-400">
                            <span className="text-white font-medium">{quiz.questions.length}</span> questions
                        </span>
                        <span className="text-zinc-400">
                            <span className="text-white font-medium">{answeredCount}</span> answered
                        </span>
                        <span className="text-zinc-400">
                            <span className="text-green-400 font-medium">{correctCount}</span> correct
                        </span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
                    <main>
                        {!currentQuestion ? (
                            <div className="bg-zinc-800 rounded-xl p-8 text-center">
                                <p className="text-zinc-400">No questions available for this topic.</p>
                            </div>
                        ) : (
                            <div className="bg-zinc-800 rounded-xl p-6">
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <span className="text-sm text-zinc-400">
                                        Question {currentIndex + 1} of {filteredQuestions.length}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${difficultyColor(currentQuestion.difficulty)}`}>
                                        {difficultyLabel(currentQuestion.difficulty)}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-zinc-700 text-zinc-300">
                                        {currentQuestion.points} pts
                                    </span>
                                    {currentQuestion.topics.map((topic) => (
                                        <span key={topic} className="text-xs px-2 py-1 rounded-full bg-zinc-700 text-zinc-300">
                                            {topic}
                                        </span>
                                    ))}
                                </div>

                                <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">
                                    {currentQuestion.prompt}
                                </h2>

                                <div className="space-y-3 mb-6">
                                    {(currentQuestion.answerMode === "single" || currentQuestion.answerMode === "boolean") && (
                                        currentQuestion.options.map((option) => (
                                            <label
                                                key={option}
                                                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
                                                    singleAnswer === option
                                                        ? "border-indigo-500 bg-indigo-500/10"
                                                        : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="single-answer"
                                                    value={option}
                                                    checked={singleAnswer === option}
                                                    onChange={(event) => setSingleAnswer(event.target.value)}
                                                    className="w-4 h-4 text-indigo-500"
                                                />
                                                <span className="text-white">{option}</span>
                                            </label>
                                        ))
                                    )}

                                    {currentQuestion.answerMode === "multiple" && (
                                        currentQuestion.options.map((option) => {
                                            const checked = multipleAnswer.includes(option);
                                            return (
                                                <label
                                                    key={option}
                                                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
                                                        checked
                                                            ? "border-indigo-500 bg-indigo-500/10"
                                                            : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        value={option}
                                                        checked={checked}
                                                        onChange={() => toggleMultiOption(option)}
                                                        className="w-4 h-4 text-indigo-500"
                                                    />
                                                    <span className="text-white">{option}</span>
                                                </label>
                                            );
                                        })
                                    )}

                                    {(currentQuestion.answerMode === "text" || currentQuestion.answerMode === "number") && (
                                        <input
                                            type={currentQuestion.answerMode === "number" ? "number" : "text"}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                                            placeholder={currentQuestion.answerMode === "number" ? "Enter a number" : "Type your answer"}
                                            value={textAnswer}
                                            onChange={(event) => setTextAnswer(event.target.value)}
                                        />
                                    )}
                                </div>

                                {currentQuestion.hint && (
                                    <div className="bg-teal-900/30 border border-teal-700/50 rounded-lg p-4 mb-6">
                                        <p className="text-sm text-teal-400 font-medium mb-1">Hint</p>
                                        <p className="text-zinc-300">{currentQuestion.hint}</p>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
                                        disabled={!canSubmit || submitting}
                                        onClick={() => void submitAnswer()}
                                    >
                                        {submitting ? "Checking..." : "Submit"}
                                    </button>
                                    <button
                                        type="button"
                                        className="px-6 py-2.5 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
                                        disabled={currentIndex >= filteredQuestions.length - 1}
                                        onClick={() => goToQuestion(currentIndex + 1)}
                                    >
                                        Next
                                    </button>
                                </div>

                                {feedback && (
                                    <div className={`mt-6 p-4 rounded-lg border ${
                                        feedback.correct
                                            ? "bg-green-900/30 border-green-700/50"
                                            : "bg-red-900/30 border-red-700/50"
                                    }`}>
                                        <p className={`font-semibold mb-2 ${feedback.correct ? "text-green-400" : "text-red-400"}`}>
                                            {feedback.correct ? "Correct!" : "Incorrect"}
                                        </p>
                                        <p className="text-zinc-300 text-sm mb-1">
                                            <span className="text-zinc-400">Answer:</span> {feedback.correctAnswer}
                                        </p>
                                        <p className="text-zinc-300 text-sm">{feedback.explanation}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>

                    <aside className="space-y-4 order-1 lg:order-2">
                        <div className="bg-zinc-800 rounded-xl p-4">
                            <label className="block text-sm text-zinc-400 mb-2" htmlFor="topic-filter">
                                Filter by topic
                            </label>
                            <select
                                id="topic-filter"
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                                value={selectedTopicId}
                                onChange={(event) => setSelectedTopicId(event.target.value)}
                            >
                                <option value="all">All topics</option>
                                {quiz.topics.map((topic) => (
                                    <option key={topic.id} value={topic.id}>
                                        {topic.name} ({topic.questionCount})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-zinc-800 rounded-xl p-4">
                            <p className="text-sm text-zinc-400 mb-3">Questions</p>
                            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                                {filteredQuestions.map((question, index) => {
                                    const state = submissions[question.questionId];
                                    let bgClass = "bg-zinc-700 hover:bg-zinc-600";
                                    if (index === currentIndex) {
                                        bgClass = "bg-indigo-600 hover:bg-indigo-500";
                                    } else if (state === true) {
                                        bgClass = "bg-green-600/30 hover:bg-green-600/40";
                                    } else if (state === false) {
                                        bgClass = "bg-red-600/30 hover:bg-red-600/40";
                                    }

                                    return (
                                        <button
                                            key={question.questionId}
                                            type="button"
                                            className={`${bgClass} text-white text-sm font-medium rounded-lg px-3 py-2 text-left transition`}
                                            onClick={() => goToQuestion(index)}
                                        >
                                            {index + 1}. {question.prompt.length > 30 ? question.prompt.slice(0, 30) + "..." : question.prompt}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
