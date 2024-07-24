"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = __importDefault(require("./customError"));
const lodash_1 = require("lodash");
const isProdEnv = process.env.NODE_ENV === "production";
const errorMap = {
    ["CastError"](error) {
        const message = `Invalid value for ${error.path}: ${error.value}!`;
        return [message, 400];
    },
    ["ValidationError"](error) {
        return [error.message, 400];
    },
    ["JsonWebTokenError"](error) {
        const message = "Invalid token! Please try again later.";
        return [message, 400];
    },
    ["TokenExpiredError"](error) {
        const message = "Token has expired! Please try again later.";
        return [message, 400];
    },
    [11000](error) {
        const keyValue = (0, lodash_1.toPairs)(error.keyValue)[0].join(": ");
        const message = `There is already an entry with <${keyValue}>. Please use another!`;
        return [message, 400];
    },
    ["genericError"](error) {
        const message = "Something went wrong! Please try again later.";
        return [message, 500];
    },
};
function asyncErrorHandler(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            var _a;
            if (isProdEnv && error.name !== "CustomError") {
                let errorKey = (_a = error.code) !== null && _a !== void 0 ? _a : error.name;
                errorKey = errorKey in errorMap ? errorKey : "genericError";
                error = new customError_1.default(...errorMap[errorKey](error));
            }
            next(error);
        });
    };
}
exports.default = asyncErrorHandler;
