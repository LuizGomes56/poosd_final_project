import { useEffect, useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";
import type { SwaggerDocs } from "backend";
import { api } from "../utils/request";
import { useClickOut } from "../hooks";
import type { SetState } from "../consts";

type QuestionData = Exclude<SwaggerDocs["questions/get"]["output"]["body"], undefined>;

type Props = {
    show: boolean;
    setShow: SetState<boolean>;
    questionId: string;
};

export default function QuestionRenderer({
    show,
    setShow,
    questionId,
}: Props) {
    const modalRef = useClickOut(() => setShow(false));

    const [question, setQuestion] = useState<QuestionData | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<boolean | null>(null);

    const [singleAnswer, setSingleAnswer] = useState("");
    const [multipleAnswers, setMultipleAnswers] = useState<string[]>([]);
    const [frqTextAnswer, setFrqTextAnswer] = useState("");
    const [frqNumberAnswer, setFrqNumberAnswer] = useState("");

    useEffect(() => {
        if (!show || !questionId) return;

        let cancelled = false;

        async function loadQuestion() {
            setLoading(true);
            setError(null);
            setResult(null);
            setQuestion(null);
            setSingleAnswer("");
            setMultipleAnswers([]);
            setFrqTextAnswer("");
            setFrqNumberAnswer("");

            try {
                const response = await api("questions/get", { question_id: questionId });

                if (cancelled) return;

                if (!response.body) {
                    setError(response.message ?? "Could not load question.");
                    return;
                }

                setQuestion(response.body);
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Unknown error.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadQuestion();

        return () => {
            cancelled = true;
        };
    }, [show, questionId]);

    const isMultipleMCQ = useMemo(() => {
        if (!question || question.type !== "MCQ") return false;
        return Array.isArray(question.choice?.answers?.multiple);
    }, [question]);

    const currentAnswer = useMemo(() => {
        if (!question) return undefined;

        if (question.type === "MCQ") {
            if (isMultipleMCQ) {
                return multipleAnswers.length > 0 ? multipleAnswers : undefined;
            }
            return singleAnswer || undefined;
        }

        if (question.type === "TF") {
            return singleAnswer || undefined;
        }

        if (question.type === "FRQ") {
            if (question.frq?.kind === "NUMBER") {
                if (!frqNumberAnswer.trim()) return undefined;
                const parsed = Number(frqNumberAnswer);
                return Number.isNaN(parsed) ? undefined : parsed;
            }

            return frqTextAnswer.trim() || undefined;
        }

        return undefined;
    }, [
        question,
        isMultipleMCQ,
        multipleAnswers,
        singleAnswer,
        frqTextAnswer,
        frqNumberAnswer,
    ]);

    function toggleMultipleOption(option: string) {
        setMultipleAnswers((prev) =>
            prev.includes(option)
                ? prev.filter((item) => item !== option)
                : [...prev, option]
        );
    }

    async function handleCheck() {
        if (!currentAnswer) {
            setError("Provide an answer before checking.");
            return;
        }

        setSubmitting(true);
        setError(null);
        setResult(null);

        try {
            const response = await api("questions/check", {
                question_id: questionId,
                answer: currentAnswer,
            });

            if (!response.body) {
                setError(response.message ?? "Could not check answer.");
                return;
            }

            setResult(response.body.correct);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div
            className={`fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 px-4 py-8 sm:px-0 ${show ? "" : "hidden"
                }`}
        >
            <div
                ref={modalRef}
                className="
                    relative flex max-h-full w-full max-w-2xl flex-col gap-6 overflow-y-auto rounded-xl p-8
                    not-dark:bg-white dark:bg-std-gray-700
                    not-dark:shadow-std-neutral-200 dark:shadow-std-neutral-700
                "
            >
                <FaTimes
                    className="absolute top-5 right-5 h-5 w-5 cursor-pointer text-zinc-400 hover:text-zinc-600"
                    onClick={() => setShow(false)}
                />

                <div className="flex flex-col gap-2 pr-8">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="rounded-md px-2 py-1 not-dark:bg-zinc-100 dark:bg-std-gray-800 not-dark:text-zinc-700 dark:text-zinc-300">
                            Question
                        </span>

                        {question && (
                            <>
                                <span className="rounded-md px-2 py-1 not-dark:bg-zinc-100 dark:bg-std-gray-800 not-dark:text-zinc-700 dark:text-zinc-300">
                                    {question.type}
                                </span>
                                <span className="rounded-md px-2 py-1 not-dark:bg-zinc-100 dark:bg-std-gray-800 not-dark:text-zinc-700 dark:text-zinc-300">
                                    {question.difficulty}
                                </span>
                                <span className="rounded-md px-2 py-1 not-dark:bg-zinc-100 dark:bg-std-gray-800 not-dark:text-zinc-700 dark:text-zinc-300">
                                    {question.points} pts
                                </span>
                            </>
                        )}
                    </div>

                    <h2 className="text-2xl font-semibold not-dark:text-zinc-900 dark:text-white">
                        Solve question
                    </h2>
                </div>

                {loading ? (
                    <div className="rounded-lg border p-4 not-dark:border-gray-250 dark:border-std-gray-600">
                        <p className="not-dark:text-zinc-600 dark:text-zinc-300">
                            Loading question...
                        </p>
                    </div>
                ) : !question ? (
                    <div className="rounded-lg border p-4 not-dark:border-red-200 dark:border-red-900/50 not-dark:bg-red-50 dark:bg-red-950/30">
                        <p className="not-dark:text-red-600 dark:text-red-300">
                            {error ?? "Question not found."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-4">
                            <div
                                className="
                                    rounded-xl border p-5
                                    not-dark:border-gray-250 dark:border-std-gray-600
                                    not-dark:bg-zinc-50 dark:bg-std-gray-750
                                "
                            >
                                <p className="whitespace-pre-wrap text-base leading-7 not-dark:text-zinc-800 dark:text-zinc-100">
                                    {question.prompt}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                {question.type === "MCQ" &&
                                    (question.choice?.options ?? []).map((option, index) => {
                                        const checked = isMultipleMCQ
                                            ? multipleAnswers.includes(option)
                                            : singleAnswer === option;

                                        return (
                                            <label
                                                key={`${option}-${index}`}
                                                className={`
                                                    flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all
                                                    ${checked
                                                        ? "not-dark:border-indigo-300 dark:border-indigo-500 not-dark:bg-indigo-50 dark:bg-indigo-950/30"
                                                        : "not-dark:border-gray-250 dark:border-std-gray-600 not-dark:bg-white dark:bg-std-gray-800"
                                                    }
                                                `}
                                            >
                                                <input
                                                    type={isMultipleMCQ ? "checkbox" : "radio"}
                                                    name="question-option"
                                                    checked={checked}
                                                    onChange={() => {
                                                        if (isMultipleMCQ) {
                                                            toggleMultipleOption(option);
                                                        } else {
                                                            setSingleAnswer(option);
                                                        }
                                                    }}
                                                    className="mt-1 h-4 w-4 accent-indigo-600"
                                                />
                                                <span className="flex-1 not-dark:text-zinc-800 dark:text-zinc-100">
                                                    {option}
                                                </span>
                                            </label>
                                        );
                                    })}

                                {question.type === "TF" &&
                                    ["True", "False"].map((option) => {
                                        const checked = singleAnswer === option;

                                        return (
                                            <label
                                                key={option}
                                                className={`
                                                    flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all
                                                    ${checked
                                                        ? "not-dark:border-indigo-300 dark:border-indigo-500 not-dark:bg-indigo-50 dark:bg-indigo-950/30"
                                                        : "not-dark:border-gray-250 dark:border-std-gray-600 not-dark:bg-white dark:bg-std-gray-800"
                                                    }
                                                `}
                                            >
                                                <input
                                                    type="radio"
                                                    name="question-tf"
                                                    checked={checked}
                                                    onChange={() => setSingleAnswer(option)}
                                                    className="h-4 w-4 accent-indigo-600"
                                                />
                                                <span className="not-dark:text-zinc-800 dark:text-zinc-100">
                                                    {option}
                                                </span>
                                            </label>
                                        );
                                    })}

                                {question.type === "FRQ" && question.frq?.kind === "TEXT" && (
                                    <textarea
                                        value={frqTextAnswer}
                                        onChange={(e) => setFrqTextAnswer(e.currentTarget.value)}
                                        placeholder="Type your answer..."
                                        className="
                                            min-h-36 w-full rounded-xl border p-4 outline-none transition-all
                                            not-dark:border-gray-250 dark:border-std-gray-600
                                            not-dark:bg-white dark:bg-std-gray-800
                                            not-dark:text-zinc-800 dark:text-zinc-100
                                            not-dark:placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                                            focus:border-indigo-400
                                        "
                                    />
                                )}

                                {question.type === "FRQ" && question.frq?.kind === "NUMBER" && (
                                    <input
                                        type="number"
                                        value={frqNumberAnswer}
                                        onChange={(e) => setFrqNumberAnswer(e.currentTarget.value)}
                                        placeholder="Type a number..."
                                        className="
                                            w-full rounded-xl border p-4 outline-none transition-all
                                            not-dark:border-gray-250 dark:border-std-gray-600
                                            not-dark:bg-white dark:bg-std-gray-800
                                            not-dark:text-zinc-800 dark:text-zinc-100
                                            not-dark:placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                                            focus:border-indigo-400
                                        "
                                    />
                                )}
                            </div>
                        </div>

                        {(error || result !== null || question.hint || question.explanation) && (
                            <div className="flex flex-col gap-3">
                                {error && (
                                    <div className="rounded-xl border p-4 not-dark:border-red-200 dark:border-red-900/50 not-dark:bg-red-50 dark:bg-red-950/30">
                                        <p className="not-dark:text-red-600 dark:text-red-300">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                {result === true && (
                                    <div className="rounded-xl border p-4 not-dark:border-emerald-200 dark:border-emerald-900/50 not-dark:bg-emerald-50 dark:bg-emerald-950/30">
                                        <p className="font-medium not-dark:text-emerald-700 dark:text-emerald-300">
                                            Correct answer.
                                        </p>
                                    </div>
                                )}

                                {result === false && (
                                    <div className="rounded-xl border p-4 not-dark:border-red-200 dark:border-red-900/50 not-dark:bg-red-50 dark:bg-red-950/30">
                                        <p className="font-medium not-dark:text-red-700 dark:text-red-300">
                                            Wrong answer.
                                        </p>
                                    </div>
                                )}

                                {result !== null && question.explanation && (
                                    <div className="rounded-xl border p-4 not-dark:border-gray-250 dark:border-std-gray-600 not-dark:bg-zinc-50 dark:bg-std-gray-750">
                                        <h3 className="mb-2 font-semibold not-dark:text-zinc-900 dark:text-white">
                                            Explanation
                                        </h3>
                                        <p className="whitespace-pre-wrap not-dark:text-zinc-700 dark:text-zinc-300">
                                            {question.explanation}
                                        </p>
                                    </div>
                                )}

                                {question.hint && (
                                    <div className="rounded-xl border p-4 not-dark:border-gray-250 dark:border-std-gray-600 not-dark:bg-zinc-50 dark:bg-std-gray-750">
                                        <h3 className="mb-2 font-semibold not-dark:text-zinc-900 dark:text-white">
                                            Hint
                                        </h3>
                                        <p className="whitespace-pre-wrap not-dark:text-zinc-700 dark:text-zinc-300">
                                            {question.hint}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShow(false)}
                                className="
                                    rounded-xl px-4 py-2.5 font-medium transition-all
                                    not-dark:bg-zinc-100 dark:bg-std-gray-800
                                    not-dark:text-zinc-700 dark:text-zinc-200
                                    hover:opacity-90
                                "
                            >
                                Close
                            </button>

                            <button
                                type="button"
                                onClick={handleCheck}
                                disabled={submitting || !question}
                                className="
                                    rounded-xl px-4 py-2.5 font-medium text-white transition-all disabled:opacity-60
                                    bg-indigo-600 hover:bg-indigo-700
                                "
                            >
                                {submitting ? "Checking..." : "Check answer"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}