export type CmsResponse<T> = {
    ok: boolean;
    status: number;
    message?: string;
    body?: T;
};

export type CmsTopic = {
    _id: string;
    name: string;
    description?: string;
};

export type CmsQuestion = {
    _id?: string;
    question_id: string;
    topic_ids: string[];
    type: "MCQ" | "TF" | "FRQ";
    prompt: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    hint?: string;
    explanation?: string;
    points?: number;
    choice?: {
        options?: string[];
        answers?: {
            single?: string;
            multiple?: string[];
        };
    };
    frq?: {
        kind: "NUMBER" | "TEXT";
        accepted_numbers?: number[];
        tolerance?: number;
        accepted_texts?: string[];
    };
};

export type DemoQuestion = {
    questionId: string;
    prompt: string;
    difficulty: CmsQuestion["difficulty"];
    type: CmsQuestion["type"];
    answerMode: "single" | "multiple" | "number" | "text" | "boolean";
    options: string[];
    topicIds: string[];
    topics: string[];
    hint: string;
    points: number;
};

export type DemoQuizPayload = {
    title: string;
    subtitle: string;
    topics: Array<{
        id: string;
        name: string;
        questionCount: number;
    }>;
    questions: DemoQuestion[];
};

export type CheckAnswerInput = {
    questionId: string;
    answer: string | string[];
};

export type CheckAnswerResult = {
    correct: boolean;
    correctAnswer: string;
    explanation: string;
};
