import type {
    CheckAnswerResult,
    CmsQuestion,
    CmsTopic,
    DemoQuestion,
    DemoQuizPayload
} from "./types.js";

function normalizeText(value: string) {
    return value.trim().toLowerCase();
}

function topicIdOf(topic: CmsTopic) {
    return String(topic._id);
}

function questionIdOf(question: CmsQuestion) {
    return String(question.question_id || question._id);
}

function answerModeOf(question: CmsQuestion): DemoQuestion["answerMode"] {
    if (question.type === "TF") {
        return "boolean";
    }

    if (question.type === "FRQ") {
        return question.frq?.kind === "NUMBER" ? "number" : "text";
    }

    return question.choice?.answers?.multiple ? "multiple" : "single";
}

function optionsOf(question: CmsQuestion) {
    if (question.type === "TF") {
        return ["True", "False"];
    }

    return question.choice?.options ?? [];
}

function formatCorrectAnswer(question: CmsQuestion) {
    if (question.type === "MCQ") {
        if (question.choice?.answers?.single) {
            return question.choice.answers.single;
        }

        if (question.choice?.answers?.multiple?.length) {
            return question.choice.answers.multiple.join(", ");
        }
    }

    if (question.type === "TF") {
        return question.choice?.answers?.single ?? "Unknown";
    }

    if (question.frq?.kind === "NUMBER") {
        const numbers = question.frq.accepted_numbers ?? [];
        const tolerance = question.frq.tolerance ?? 0;
        const joined = numbers.join(" or ");
        return tolerance > 0 ? `${joined} (tolerance ±${tolerance})` : joined;
    }

    if (question.frq?.kind === "TEXT") {
        return (question.frq.accepted_texts ?? []).join(" / ");
    }

    return "Unknown";
}

function isCorrect(question: CmsQuestion, answer: string | string[]) {
    if (question.type === "MCQ") {
        const single = question.choice?.answers?.single;
        const multiple = question.choice?.answers?.multiple;

        if (single) {
            return typeof answer === "string" && answer === single;
        }

        if (!Array.isArray(answer) || !multiple) {
            return false;
        }

        const expected = [...multiple].sort();
        const received = [...answer].sort();
        return expected.length === received.length
            && expected.every((value, index) => value === received[index]);
    }

    if (question.type === "TF") {
        if (Array.isArray(answer)) {
            return false;
        }

        const expected = normalizeText(question.choice?.answers?.single ?? "");
        const received = normalizeText(answer);
        return expected === received;
    }

    if (!question.frq || Array.isArray(answer)) {
        return false;
    }

    if (question.frq.kind === "NUMBER") {
        const parsed = Number(answer);
        if (!Number.isFinite(parsed)) {
            return false;
        }

        const tolerance = question.frq.tolerance ?? 0;
        return (question.frq.accepted_numbers ?? []).some((target) => {
            return Math.abs(target - parsed) <= tolerance;
        });
    }

    const normalized = normalizeText(answer);
    return (question.frq.accepted_texts ?? []).some((text) => normalizeText(text) === normalized);
}

export function sanitizeQuiz(topics: CmsTopic[], questions: CmsQuestion[]): DemoQuizPayload {
    const topicMap = new Map(
        topics.map((topic) => [topicIdOf(topic), topic.name])
    );

    const sanitizedQuestions = questions.map((question) => {
        const topicIds = question.topic_ids.map(String);

        return {
            questionId: questionIdOf(question),
            prompt: question.prompt,
            difficulty: question.difficulty,
            type: question.type,
            answerMode: answerModeOf(question),
            options: optionsOf(question),
            topicIds,
            topics: topicIds.map((topicId) => topicMap.get(topicId) ?? "Unassigned topic"),
            hint: question.hint ?? "",
            points: question.points ?? 100
        } satisfies DemoQuestion;
    });

    const topicCounts = new Map<string, number>();
    sanitizedQuestions.forEach((question) => {
        question.topicIds.forEach((topicId) => {
            topicCounts.set(topicId, (topicCounts.get(topicId) ?? 0) + 1);
        });
    });

    return {
        title: "Quiz",
        subtitle: "",
        topics: topics.map((topic) => ({
            id: topicIdOf(topic),
            name: topic.name,
            questionCount: topicCounts.get(topicIdOf(topic)) ?? 0
        })),
        questions: sanitizedQuestions
    };
}

export function evaluateAnswer(question: CmsQuestion, answer: string | string[]): CheckAnswerResult {
    return {
        correct: isCorrect(question, answer),
        correctAnswer: formatCorrectAnswer(question),
        explanation: question.explanation?.trim() || "This question does not have an explanation yet."
    };
}
