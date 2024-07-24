import e from "express";
import User, { generateCode, hash } from "../models/user.model";
import jwt from "jsonwebtoken";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import CustomError from "../utils/customError";
import { pick } from "lodash";
import { sendMail } from "../utils/email";

const tokenCookieName = "jwt";
const isProdEnv = process.env.NODE_ENV === "production";

// const genAuthToken = (id: string) => {
//   const token = jwt.sign({ id }, process.env.SECRET_KEY!, {
//     expiresIn: process.env.EXPIRATION,
//   });
//   const decoded = jwt.decode(token) as jwt.JwtPayload;
//   return { token, expiresIn: decoded.exp! - decoded.iat! };
// };

// export const sendTokenResponse = (
//   res: e.Response,
//   statusCode: number,
//   user: InstanceType<typeof User>
// ) => {
//   const token = genAuthToken(user.id);
//   user.active = user.password = undefined!;
//   res.status(statusCode).json({
//     status: "success",
//     user,
//     ...token,
//   });
// };

export const sendTokenResponse = (
  res: e.Response,
  statusCode: number,
  user: InstanceType<typeof User>
) => {
  const token = jwt.sign(pick(user, ["id"]), process.env.SECRET_KEY!, {
    expiresIn: process.env.EXPIRATION,
  });
  const decoded = jwt.decode(token) as jwt.JwtPayload;
  res.cookie(tokenCookieName, token, {
    httpOnly: true,
    secure: isProdEnv,
    maxAge: decoded.exp! - decoded.iat!,
    sameSite: "strict",
  });
  user.password = undefined!;
  res.status(statusCode).json({
    status: "success",
    data: { user }
  });
};

export const register = asyncErrorHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  sendTokenResponse(res, 201, user);
});

export const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new CustomError("Email or password is incorrect.", 401);
  }
  sendTokenResponse(res, 200, user);
});

export const protect = asyncErrorHandler(async (req, res, next) => {
  // if (!req.headers.authorization) {
  //   throw new CustomError("Authorization header is missing.", 401);
  // }
  // const [bearer, token] = req.headers.authorization?.split(" ");
  // if (bearer !== "Bearer") {
  //   throw new CustomError("Authorization header is not a <Bearer> token.", 401);
  // }

  const token = req.cookies[tokenCookieName];
  if (!token) {
    throw new CustomError("Access denied. No token provided.", 401);
  }
  const decoded = jwt.verify(token, process.env.SECRET_KEY!) as jwt.JwtPayload;
  const user = await User.findById(decoded.id).select("+password");
  if (!user) {
    throw new CustomError("This user does not exist.", 401);
  }
  if (user.isPasswordChanged(decoded.iat!)) {
    throw new CustomError("Password changed after token issued.", 401);
  }
  req.user = user;
  next();
});

// export const forgotPassword = asyncErrorHandler(async (req, res, next) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new CustomError("This email does not exist.", 404);
//   }
//   const resetCode = generateCode().toString();
//   await sendMail(user.email, resetCode);

//   user.passwordResetCode = hash(resetCode);
//   user.passwordResetCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
//   user.save({ validateBeforeSave: false });

//   res.status(200).json({
//     status: "success",
//     message: "Email sent with password reset code.",
//   });
// });

// export const passwordReset = asyncErrorHandler(async (req, res, next) => {
//   const { code, password, confirmPassword } = req.body;
//   const user = await User.findOne({
//     passwordResetCode: hash(code),
//     passwordResetCodeExpires: { $gte: Date.now() },
//   });
//   if (!user) {
//     throw new CustomError("Invalid or expired code.", 404);
//   }
//   user.password = password;
//   user.confirmPassword = confirmPassword;
//   sendTokenResponse(res, 200, await user.save());
// });
