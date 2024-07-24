"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = exports.login = exports.register = exports.sendTokenResponse = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncErrorHandler_1 = __importDefault(require("../utils/asyncErrorHandler"));
const customError_1 = __importDefault(require("../utils/customError"));
const lodash_1 = require("lodash");
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
const sendTokenResponse = (res, statusCode, user) => {
    const token = jsonwebtoken_1.default.sign((0, lodash_1.pick)(user, ["id"]), process.env.SECRET_KEY, {
        expiresIn: process.env.EXPIRATION,
    });
    const decoded = jsonwebtoken_1.default.decode(token);
    res.cookie(tokenCookieName, token, {
        httpOnly: true,
        secure: isProdEnv,
        maxAge: decoded.exp - decoded.iat,
        sameSite: "strict",
    });
    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        data: { user }
    });
};
exports.sendTokenResponse = sendTokenResponse;
exports.register = (0, asyncErrorHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.create(req.body);
    (0, exports.sendTokenResponse)(res, 201, user);
}));
exports.login = (0, asyncErrorHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_model_1.default.findOne({ email }).select("+password");
    if (!user || !(yield user.isPasswordCorrect(password))) {
        throw new customError_1.default("Email or password is incorrect.", 401);
    }
    (0, exports.sendTokenResponse)(res, 200, user);
}));
exports.protect = (0, asyncErrorHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // if (!req.headers.authorization) {
    //   throw new CustomError("Authorization header is missing.", 401);
    // }
    // const [bearer, token] = req.headers.authorization?.split(" ");
    // if (bearer !== "Bearer") {
    //   throw new CustomError("Authorization header is not a <Bearer> token.", 401);
    // }
    const token = req.cookies[tokenCookieName];
    if (!token) {
        throw new customError_1.default("Access denied. No token provided.", 401);
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
    const user = yield user_model_1.default.findById(decoded.id).select("+password");
    if (!user) {
        throw new customError_1.default("This user does not exist.", 401);
    }
    if (user.isPasswordChanged(decoded.iat)) {
        throw new customError_1.default("Password changed after token issued.", 401);
    }
    req.user = user;
    next();
}));
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
