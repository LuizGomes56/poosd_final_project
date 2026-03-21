import express from "express";
import routes from "./routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import "./utils/global";
import { PrismaClient } from "./generated/prisma/client";
import { Middleware } from "./utils/middleware";
import { getRouteMethods } from "./utils/http";
dotenv.config();

export const Dotenv = {
    database_url: process.env.DATABASE_URL!,
    jwt_secret: process.env.JWT_SECRET!
}

for (const value of Object.values(Dotenv)) {
    if (!value) {
        throw new Error(`Environment variable ${value} is not defined`);
    }
}

export const prisma = new PrismaClient();

const app = express();

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", Middleware.require, routes);
// getRouteMethods(app);

app.listen(3000, (e) => {
    if (e) {
        console.error(e);
    }
    console.log("Server started on port 3000");
});

export default app;