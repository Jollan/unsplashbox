"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const customError_1 = __importDefault(require("./utils/customError"));
const image_routes_1 = __importDefault(require("./routes/image.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const collection_routes_1 = __importDefault(require("./routes/collection.routes"));
const error_controller_1 = __importDefault(require("./controllers/error.controller"));
const app = (0, express_1.default)();
const limiter = (0, express_rate_limit_1.default)({
    limit: 1000,
    windowMs: 60 * 60 * 1000,
    message: `We have received to many requests from this IP. Please try after one hour.`,
});
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use("/api", limiter);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static("./uploads"));
app.use(express_1.default.json({ limit: "10kb" }));
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/images", image_routes_1.default);
app.use("/api/v1/collections", collection_routes_1.default);
app.all("*", (req, res, next) => {
    const error = new customError_1.default(`Can't find <${req.method} ${req.originalUrl}> on the server!`, 404);
    next(error);
});
app.use(error_controller_1.default);
module.exports = app;
