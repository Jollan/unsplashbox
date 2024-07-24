import e from "express";
import CustomError from "./customError";
import { toPairs } from "lodash";
import { AsyncRequestHandler } from "./model";

const isProdEnv = process.env.NODE_ENV === "production";

const errorMap: { [key: string]: (error: any) => [string, number] } = {
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
    const keyValue = toPairs(error.keyValue)[0].join(": ");
    const message = `There is already an entry with <${keyValue}>. Please use another!`;
    return [message, 400];
  },

  ["genericError"](error) {
    const message = "Something went wrong! Please try again later.";
    return [message, 500];
  },
};

function asyncErrorHandler(fn: AsyncRequestHandler): e.RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      if (isProdEnv && error.name !== "CustomError") {
        let errorKey = error.code ?? error.name;
        errorKey = errorKey in errorMap ? errorKey : "genericError";
        error = new CustomError(...errorMap[errorKey](error));
      }
      next(error);
    });
  };
}

export default asyncErrorHandler;
