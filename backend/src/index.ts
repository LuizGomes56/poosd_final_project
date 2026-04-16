import express from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Middleware } from "./utils/middleware.js";
import { getRouteMethods } from "./utils/http.js";
import * as _ from "./utils/global.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { Dotenv } from "./utils/env.js";

const app = express();

// Validate environment variables, this is happening here because we want to allow
// function getRouteMethods to run before this, so you can generate `/methods.ts` file
for (const [key, value] of Object.entries(Dotenv)) {
    if (!value) {
        throw new Error(`Environment variable ${key.toUpperCase()} is not defined`);
    }
}

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://YOURIPV4:3000",
        "http://localhost",
        "http://localhost/",
        Dotenv.cors_origin,
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

const conn = await mongoose.connect(Dotenv.database_url);
console.log(`MongoDB connected: ${conn.connection.host}`);

app.listen(Dotenv.port, async (e) => {
    if (e) {
        console.error(e);
    }
    console.log(`Server started on port ${Dotenv.port}`);
});

export default app;