import express from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Middleware } from "./utils/middleware.js";
import { getRouteMethods } from "./utils/http.js";
import * as _ from "./utils/global.js";
import mongoose from "mongoose";
import { Dotenv } from "./utils/env.js";

const app = express();

// Validate environment variables, this is happening here because we want to allow
// function getRouteMethods to run before this, so you can generate `/methods.ts` file
for (const [key, value] of Object.entries(Dotenv)) {
    if (!value) {
        throw new Error(`Environment variable ${key.toUpperCase()} is not defined`);
    }
}

const allowedOrigins = [
    "http://project.cop4331.cc",
    "https://project.cop4331.cc",
    "http://api.project.cop4331.cc",
    "https://api.project.cop4331.cc",
    "http://localhost:5173",
];

const corsOptions: cors.CorsOptions = {
    origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked: ${origin}`));
    },
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

console.log("Trying to connect to the database");
const conn = await mongoose.connect(Dotenv.database_url);
console.log(`MongoDB connected: ${conn.connection.host}`);

app.listen(Dotenv.port, async (e) => {
    if (e) {
        console.error(e);
    }
    console.log(`Server started on port ${Dotenv.port}`);
});

export default app;
