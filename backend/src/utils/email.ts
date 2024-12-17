import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config()

const oAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

async function sendMail(to: string, subject: string, text: string) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: "gmail", // Use the "service" field for Gmail
            auth: {
                type: "OAuth2",
                user: process.env.GMAIL_USER,
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN,
                accessToken: accessToken as string, // Explicitly cast to string
            },
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to,
            subject,
            text,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", result);
        return result;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

export default sendMail;