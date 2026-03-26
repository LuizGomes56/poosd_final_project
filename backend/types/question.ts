export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "short_response"
  | "long_response"
  | "numeric_response";

export interface QuestionBase {
  id: string;
  type: QuestionType;
  prompt: string;
  topicIds: string[];
  answerHint?: string | null;
  explanation?: string | null;
  points?: number | null;
}

export interface Choice {
  id: string;
  label: string;
}

export interface MultipleChoiceQuestion extends QuestionBase {
  type: "multiple_choice";
  choices: Choice[];
  multiple?: boolean | null;
  answerIds: string[];
}

export interface TrueFalseQuestion extends QuestionBase {
  type: "true_false";
  answer: boolean;
}

export interface ShortResponseQuestion extends QuestionBase {
  type: "short_response";
  answers?: string[];
}

export interface LongResponseQuestion extends QuestionBase {
  type: "long_response";
}

export interface NumericResponseQuestion extends QuestionBase {
  type: "numeric_response";
  answer: number;
  unit?: string | null;
  tolerance?: number | null;
}

export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | ShortResponseQuestion
  | LongResponseQuestion
  | NumericResponseQuestion;

export interface Topic {
  id: string;
  name: string;
}
