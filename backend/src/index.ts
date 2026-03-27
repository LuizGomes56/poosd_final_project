import express from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { Middleware } from "./utils/middleware.js";
import { getRouteMethods } from "./utils/http.js";
import * as _ from "./utils/global.js";
import mongoose from "mongoose";
dotenv.config();

export const Dotenv = {
    database_url: process.env.DATABASE_URL!,
    jwt_secret: process.env.JWT_SECRET!,
    port: Number(process.env.port!) || 3000
}

for (const [key, value] of Object.entries(Dotenv)) {
    if (!value) {
        throw new Error(`Environment variable ${key}:snake:upper is not defined`);
    }
}

const app = express();

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * I guarantee that the following middlewares will always work, so we cast
 * them to `any`
 */
app.use("/", Middleware.schema as any);
app.use("/api", Middleware.helpers as any, routes);
getRouteMethods(app);

app.listen(Dotenv.port, async (e) => {
    const conn = await mongoose.connect(Dotenv.database_url);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    if (e) {
        console.error(e);
    }
    console.log(`Server started on port ${Dotenv.port}`);
});

export default app;