import e from "express";
import * as authController from "../controllers/auth.controller";

const authRouter = e.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
// authRouter.post("/forgotPassword", authController.forgotPassword);
// authRouter.patch("/passwordReset", authController.passwordReset);

export = authRouter;
