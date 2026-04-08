import express from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { Middleware } from "./utils/middleware.js";
import { getRouteMethods } from "./utils/http.js";
import * as _ from "./utils/global.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://YOURIPV4:3000",
        "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * I guarantee that the following middlewares will always work, so we cast
 * them to `any`
 */
app.use("/api", Middleware.schema);
app.use("/api", Middleware.helpers as any, routes);
getRouteMethods(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontend = path.join(__dirname, "../../frontend/dist");

app.use(express.static(frontend));
app.get("*", (_, res) => {
    res.sendFile(path.join(frontend, "index.html"));
});

export const Dotenv = {
    database_url: process.env.DATABASE_URL!,
    jwt_secret: process.env.JWT_SECRET!,
    port: Number(process.env.port!) || 3000,
    iam_user_name: process.env.IAM_USER_NAME!,
    ses_smtp_password: process.env.SES_SMTP_PASSWORD!,
    ses_smtp_user: process.env.SES_SMTP_USER!,
    ses_smtp_host: process.env.SES_SMTP_HOST!,
    email_sender: process.env.EMAIL_SENDER!,
    domain: process.env.DOMAIN!,
}

for (const [key, value] of Object.entries(Dotenv)) {
    if (!value) {
        throw new Error(`Environment variable ${key.toUpperCase()} is not defined`);
    }
}

app.listen(Dotenv.port, async (e) => {
    const conn = await mongoose.connect(Dotenv.database_url);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    if (e) {
        console.error(e);
    }
    console.log(`Server started on port ${Dotenv.port}`);
});

export default app;