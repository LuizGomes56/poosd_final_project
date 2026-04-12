import {
    OpenAPIRegistry,
    OpenApiGeneratorV3,
    extendZodWithOpenApi
} from "@asteasolutions/zod-to-openapi";
import { z, type ZodTypeAny } from "zod";
import { BACKEND_PROTECTED_ROUTES, BACKEND_ROUTES } from "./routes/methods.js";
import { SCHEMA } from "./schema.js";
import type { Route } from "./types.js";

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();
const protectedRoutes = new Set<string>(BACKEND_PROTECTED_ROUTES);

const UserSchema = registry.register(
    "User",
    z.object({
        _id: z.string(),
        full_name: z.string(),
        email: z.email(),
        email_verified: z.boolean(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional()
    }).passthrough()
);

const LoginResponseSchema = registry.register(
    "LoginResponse",
    UserSchema.extend({
        token: z.string()
    }).passthrough()
);

const VerifiedUserSchema = registry.register(
    "VerifiedUser",
    UserSchema.extend({
        user_id: z.string()
    }).passthrough()
);

const TopicSchema = registry.register(
    "Topic",
    z.object({
        _id: z.string().optional(),
        topic_id: z.string().optional(),
        user_id: z.string().optional(),
        name: z.string(),
        description: z.string().optional(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional()
    }).passthrough()
);

const QuestionChoiceSchema = registry.register(
    "QuestionChoice",
    z.object({
        options: z.array(z.string()).optional(),
        answers: z.object({
            single: z.string().optional(),
            multiple: z.array(z.string()).optional()
        }).optional()
    })
);

const QuestionFrqSchema = registry.register(
    "QuestionFrq",
    z.union([
        z.object({
            kind: z.literal("NUMBER"),
            accepted_numbers: z.array(z.number()).optional(),
            tolerance: z.number().optional()
        }),
        z.object({
            kind: z.literal("TEXT"),
            accepted_texts: z.array(z.string()).optional()
        })
    ])
);

const QuestionSchema = registry.register(
    "Question",
    z.object({
        _id: z.string().optional(),
        question_id: z.string(),
        user_id: z.string().optional(),
        topic_ids: z.array(z.string()),
        type: z.enum(["MCQ", "TF", "FRQ"]),
        prompt: z.string(),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
        hint: z.string().optional(),
        explanation: z.string().optional(),
        points: z.number().optional(),
        choice: QuestionChoiceSchema.optional(),
        frq: QuestionFrqSchema.optional(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional()
    }).passthrough()
);

const QuestionCheckResultSchema = registry.register(
    "QuestionCheckResult",
    z.object({
        correct: z.boolean(),
        question_id: z.string()
    })
);

const ApiErrorSchema = registry.register(
    "ApiError",
    z.object({
        ok: z.boolean(),
        status: z.number(),
        message: z.string().optional(),
        body: z.unknown().optional()
    })
);

function envelope(bodySchema?: ZodTypeAny) {
    const shape: Record<string, ZodTypeAny> = {
        ok: z.boolean(),
        status: z.number(),
        message: z.string().optional()
    };

    if (bodySchema) {
        shape.body = bodySchema.optional();
    }

    return z.object(shape);
}

function jsonContent(schema: ZodTypeAny) {
    return {
        "application/json": {
            schema
        }
    };
}

function tagName(route: Route) {
    const prefix = route.split("/")[0];

    if (prefix === "users") return "Users";
    if (prefix === "questions") return "Questions";
    return "Topics";
}

function operationId(route: Route) {
    const [group, action] = route.split("/");
    return `${group}${action
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")}`;
}

const routeMeta: Record<Route, {
    summary: string;
    description: string;
    responseSchema?: ZodTypeAny;
}> = {
    "users/login": {
        summary: "Log in",
        description: "Authenticates a user and returns a JWT plus the user payload.",
        responseSchema: LoginResponseSchema
    },
    "users/logout": {
        summary: "Log out",
        description: "Clears the authorization cookie for the current session."
    },
    "users/register": {
        summary: "Register account",
        description: "Creates a new EduCMS account."
    },
    "users/forgot_password": {
        summary: "Request password reset",
        description: "Starts the password reset flow for a known email address."
    },
    "users/reset_password": {
        summary: "Reset password",
        description: "Completes the password reset flow using a verification code and a new password."
    },
    "users/verify": {
        summary: "Verify session",
        description: "Returns the authenticated user payload for the current JWT.",
        responseSchema: VerifiedUserSchema
    },
    "users/verify_email": {
        summary: "Verify email",
        description: "Consumes a six-digit verification code for the authenticated user."
    },
    "users/send_email_verification": {
        summary: "Send email verification",
        description: "Sends a verification code to the authenticated user's email address."
    },
    "questions/create": {
        summary: "Create question",
        description: "Creates a new question in the authenticated user's question bank.",
        responseSchema: QuestionSchema
    },
    "questions/all": {
        summary: "List questions",
        description: "Returns all questions for the authenticated user, optionally filtered by topic.",
        responseSchema: z.array(QuestionSchema)
    },
    "questions/update": {
        summary: "Update question",
        description: "Updates a question owned by the authenticated user.",
        responseSchema: QuestionSchema
    },
    "questions/delete": {
        summary: "Delete question",
        description: "Deletes a question owned by the authenticated user.",
        responseSchema: QuestionSchema
    },
    "questions/check": {
        summary: "Check answer",
        description: "Checks whether a submitted answer matches the stored answer for the question.",
        responseSchema: QuestionCheckResultSchema
    },
    "questions/get": {
        summary: "Get question",
        description: "Returns a single question owned by the authenticated user.",
        responseSchema: QuestionSchema
    },
    "topics/create": {
        summary: "Create topic",
        description: "Creates a new topic for the authenticated user.",
        responseSchema: TopicSchema
    },
    "topics/delete": {
        summary: "Delete topic",
        description: "Deletes a topic by ID.",
        responseSchema: TopicSchema
    },
    "topics/update": {
        summary: "Update topic",
        description: "Updates a topic name and/or description.",
        responseSchema: TopicSchema
    },
    "topics/all": {
        summary: "List topics",
        description: "Returns all topics for the authenticated user.",
        responseSchema: z.array(TopicSchema)
    }
};

for (const [route, method] of Object.entries(BACKEND_ROUTES) as [Route, string][]) {
    const schema = SCHEMA[route];
    const meta = routeMeta[route];
    const tag = tagName(route);
    const requestBody = method === "GET"
        ? undefined
        : {
            body: {
                description: `${meta.summary} request body`,
                content: jsonContent(schema)
            }
        };

    registry.registerPath({
        method: method.toLowerCase() as "get" | "post" | "put" | "patch" | "delete",
        path: `/${route}`,
        operationId: operationId(route),
        summary: meta.summary,
        description: meta.description,
        tags: [tag],
        security: protectedRoutes.has(route)
            ? [{ bearerAuth: [] }]
            : undefined,
        request: requestBody,
        responses: {
            200: {
                description: "Successful response",
                content: jsonContent(envelope(meta.responseSchema))
            },
            400: {
                description: "Bad request or validation failure",
                content: jsonContent(ApiErrorSchema)
            },
            401: {
                description: "Unauthorized request",
                content: jsonContent(ApiErrorSchema)
            },
            404: {
                description: "Requested resource not found",
                content: jsonContent(ApiErrorSchema)
            },
            500: {
                description: "Internal server error",
                content: jsonContent(ApiErrorSchema)
            }
        }
    });
}

const generator = new OpenApiGeneratorV3(registry.definitions);

export const swaggerDocument = generator.generateDocument({
    openapi: "3.0.3",
    info: {
        title: "EduCMS API",
        version: "1.0.0",
        description: "REST API for EduCMS, covering authentication, question management, and topic management."
    },
    servers: [
        {
            url: "/api",
            description: "Default server (base path)"
        }
    ],
    tags: [
        { name: "Users", description: "Authentication, verification, and password recovery routes" },
        { name: "Questions", description: "Question bank management routes" },
        { name: "Topics", description: "Topic management routes" }
    ]
});

swaggerDocument.components = {
    ...(swaggerDocument.components ?? {}),
    securitySchemes: {
        bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "JWT sent in the Authorization header as `Bearer <token>`."
        }
    }
};
