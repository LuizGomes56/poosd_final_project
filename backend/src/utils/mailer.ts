import { Dotenv } from "./env.js";
import nodemailer from "nodemailer";

function isMissing(value: string | undefined) {
    return !value || value.trim() === "" || value.trim().toUpperCase() === "NONE";
}

const SMTP_ENABLED = ![
    Dotenv.ses_smtp_host,
    Dotenv.ses_smtp_user,
    Dotenv.ses_smtp_password,
    Dotenv.email_sender,
].some(isMissing);

const transporter = SMTP_ENABLED
    ? nodemailer.createTransport({
        host: Dotenv.ses_smtp_host,
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: Dotenv.ses_smtp_user,
            pass: Dotenv.ses_smtp_password,
        },
    })
    : null;

export async function sendMail(message: nodemailer.SendMailOptions) {
    if (!SMTP_ENABLED || !transporter) {
        return false;
    }

    await transporter.sendMail(message);
    return true;
}
