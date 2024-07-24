"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalErrorHandler = (error, req, res, next) => {
    switch (process.env.NODE_ENV) {
        case "development":
            res.status(error.statusCode || 500).json({
                status: error.status || "error",
                message: error.message,
                stackTrace: error.stack,
                error,
            });
            break;
        case "production":
            res
                .status(error.statusCode)
                .json({ status: error.status, message: error.message });
            break;
    }
};
exports.default = globalErrorHandler;
