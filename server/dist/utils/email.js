"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const isProdEnv = process.env.NODE_ENV === "production";
const transporter = nodemailer_1.default.createTransport({
    service: isProdEnv ? "gmail" : undefined,
    host: isProdEnv ? "smtp.gmail.com" : "sandbox.smtp.mailtrap.io",
    port: isProdEnv ? 465 : 587,
    secure: isProdEnv,
    auth: {
        user: isProdEnv ? process.env.EMAIL_USER : process.env.EMAIL_USER_DEV,
        pass: isProdEnv ? process.env.EMAIL_APP_PASS : process.env.EMAIL_PASS_DEV,
    },
});
const sendMail = (email, resetCode) => {
    return transporter.sendMail({
        from: {
            name: "Unsplash Box",
            address: "unsplashbox.official@gmail.com",
        },
        to: email,
        subject: "Your password reset code (valid for 10 minutes)",
        html: `Please, use this six digits code to reset your password.<br>${resetCode}`,
    });
};
exports.sendMail = sendMail;
