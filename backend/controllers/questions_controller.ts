import { Dotenv, prisma } from "../index";
import { HttpStatus } from "../utils/http";
import type { Controller } from "../routes/types";

export const QuestionsController = {
    create: async function (req, res) {
        return res.unimplemented();
    },
} as const satisfies Controller["questions"]