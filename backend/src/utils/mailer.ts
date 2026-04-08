import { Dotenv } from "..";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: Dotenv.ses_smtp_host,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: Dotenv.ses_smtp_user,
        pass: Dotenv.ses_smtp_password,
    },
});

export default transporter;