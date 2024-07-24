import nodemailer from "nodemailer";

const isProdEnv = process.env.NODE_ENV === "production";

const transporter = nodemailer.createTransport({
  service: isProdEnv ? "gmail" : undefined,
  host: isProdEnv ? "smtp.gmail.com" : "sandbox.smtp.mailtrap.io",
  port: isProdEnv ? 465 : 587,
  secure: isProdEnv,
  auth: {
    user: isProdEnv ? process.env.EMAIL_USER : process.env.EMAIL_USER_DEV,
    pass: isProdEnv ? process.env.EMAIL_APP_PASS : process.env.EMAIL_PASS_DEV,
  },
});

export const sendMail = (email: string, resetCode: string) => {
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
