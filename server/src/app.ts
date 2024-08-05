import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import sanitize from "express-mongo-sanitize";
import CustomError from "./utils/customError";
import imageRouter from "./routes/image.routes";
import authRouter from "./routes/auth.routes";
import collectionRouter from "./routes/collection.routes";
import globalErrorHandler from "./controllers/error.controller";

const app = express();

app.set("trust proxy", 1);

const limiter = rateLimit({
  limit: 1000,
  windowMs: 60 * 60 * 1000,
  message: `Too many requests from this IP, Please try after one hour.`,
  keyGenerator: (req, res) => {
    return req.ip!;
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message);
  },
});

app.use(helmet());
app.use(cors());
app.use("/api", limiter);
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(sanitize());
app.use(morgan("dev"));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/images", imageRouter);
app.use("/api/v1/collections", collectionRouter);
app.all("*", (req, res, next) => {
  const error = new CustomError(
    `Can't find <${req.method} ${req.originalUrl}> on the server!`,
    404
  );
  next(error);
});
app.use(globalErrorHandler);

export = app;
