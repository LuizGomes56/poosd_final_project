import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getQuestion, getQuestions, getTopics } from "./cms.js";
import { evaluateAnswer, sanitizeQuiz } from "./quiz.js";
import type { CheckAnswerInput } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const port = Number(process.env.PORT || 3001);
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:4173";

app.use(cors({
    origin: frontendOrigin,
    credentials: false
}));

app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.json({
        ok: true
    });
});

app.get("/api/quiz", async (_req, res) => {
    try {
        const [topics, questions] = await Promise.all([
            getTopics(),
            getQuestions()
        ]);

        res.json({
            ok: true,
            body: sanitizeQuiz(topics, questions)
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: error instanceof Error ? error.message : String(error)
        });
    }
});

app.post("/api/check", async (req, res) => {
    const body = req.body as Partial<CheckAnswerInput>;

    if (!body.questionId || body.answer === undefined) {
        return res.status(400).json({
            ok: false,
            message: "questionId and answer are required"
        });
    }

    if (typeof body.answer !== "string" && !Array.isArray(body.answer)) {
        return res.status(400).json({
            ok: false,
            message: "answer must be a string or an array of strings"
        });
    }

    try {
        const question = await getQuestion(body.questionId);
        const result = evaluateAnswer(question, body.answer);

        return res.json({
            ok: true,
            body: result
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: error instanceof Error ? error.message : String(error)
        });
    }
});

const frontendDist = path.join(__dirname, "../../frontend/dist");
const frontendIndex = path.join(frontendDist, "index.html");

if (existsSync(frontendIndex)) {
    app.use(express.static(frontendDist));
    app.use((_req, res) => {
        res.sendFile(frontendIndex);
    });
} else {
    app.use((_req, res) => {
        res.status(503).json({
            ok: false,
            message: "Demo frontend has not been built yet. Run `npm run build` in demo/frontend."
        });
    });
}

app.listen(port, () => {
    console.log(`EduCMS demo backend listening on ${port}`);
});
