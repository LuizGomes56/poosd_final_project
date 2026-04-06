export type DemoQuestion = {
    questionId: string;
    prompt: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    type: "MCQ" | "TF" | "FRQ";
    answerMode: "single" | "multiple" | "number" | "text" | "boolean";
    options: string[];
    topicIds: string[];
    topics: string[];
    hint: string;
    points: number;
};

export type DemoQuiz = {
    title: string;
    subtitle: string;
    topics: Array<{
        id: string;
        name: string;
        questionCount: number;
    }>;
    questions: DemoQuestion[];
};

export type ApiEnvelope<T> = {
    ok: boolean;
    message?: string;
    body?: T;
};

export type CheckResponse = {
    correct: boolean;
    correctAnswer: string;
    explanation: string;
};
