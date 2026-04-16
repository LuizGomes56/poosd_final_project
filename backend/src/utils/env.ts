import dotenv from "dotenv";

dotenv.config();

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
    cors_origin: process.env.CORS_ORIGIN || "http://localhost"
};