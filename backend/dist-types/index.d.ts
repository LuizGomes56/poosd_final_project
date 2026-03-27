export declare const Dotenv: {
    database_url: string;
    jwt_secret: string;
};
export declare const prisma: import("./generated/prisma/internal/class").PrismaClient<never, import("./generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined, import("@prisma/client/runtime/library").DefaultArgs>;
declare const app: import("express-serve-static-core").Express;
export default app;
