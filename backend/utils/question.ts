import { Prisma } from "../generated/prisma";
import { Question } from "../types/question";

export type PrismaQuestion = Prisma.QuestionGetPayload<{
  include: {
    multipleChoice: true;
    trueFalse: true;
    shortResponse: true;
    longResponse: true;
    numericResponse: true;
  };
}>;

export function toQuestion(question: PrismaQuestion): Question {
  const base = {
    id: question.id,
    type: question.type,
    prompt: question.prompt,
    topicIds: question.topicIds,
    answerHint: question.answerHint,
    explanation: question.explanation,
    points: question.points,
  };

  switch (question.type) {
    case "multiple_choice":
      if (!question.multipleChoice) {
        throw new Error("Missing multipleChoice data");
      }

      return {
        ...base,
        type: "multiple_choice",
        choices: question.multipleChoice.choices,
        multiple: question.multipleChoice.multiple ?? false,
        answerIds: question.multipleChoice.answerIds,
      };

    case "true_false":
      if (!question.trueFalse) {
        throw new Error("Missing trueFalse data");
      }

      return {
        ...base,
        type: "true_false",
        answer: question.trueFalse.answer,
      };

    case "short_response":
      if (!question.shortResponse) {
        throw new Error("Missing shortResponse data");
      }

      return {
        ...base,
        type: "short_response",
        answers: question.shortResponse.answers,
      };

    case "long_response":
      if (!question.longResponse) {
        throw new Error("Missing longResponse data");
      }

      return {
        ...base,
        type: "long_response",
      };

    case "numeric_response":
      if (!question.numericResponse) {
        throw new Error("Missing numericResponse data");
      }

      return {
        ...base,
        type: "numeric_response",
        answer: question.numericResponse.answer,
        unit: question.numericResponse.unit,
        tolerance: question.numericResponse.tolerance,
      };
  }
}
