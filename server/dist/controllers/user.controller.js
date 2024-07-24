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
exports.deleteMe = exports.updateMe = exports.passwordUpdate = exports.getUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const asyncErrorHandler_1 = __importDefault(require("../utils/asyncErrorHandler"));
const customError_1 = __importDefault(require("../utils/customError"));
const auth_controller_1 = require("./auth.controller");
exports.getUsers = (0, asyncErrorHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find();
    res.status(200).json({
        status: "success",
        length: users.length,
        data: { users },
    });
}));
exports.passwordUpdate = (0, asyncErrorHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { currentPassword, password, confirmPassword } = req.body;
    if (!(yield user.isPasswordCorrect(currentPassword))) {
        throw new customError_1.default("Current password do not match.", 404);
    }
    user.password = password;
    user.confirmPassword = confirmPassword;
    (0, auth_controller_1.sendTokenResponse)(res, 200, yield user.save());
}));
exports.updateMe = (0, asyncErrorHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if ("password" in req.body || "confirmPassword" in req.body) {
        throw new customError_1.default("You cannot update your password using this endpoint.", 400);
    }
    const user = yield user_model_1.default.findByIdAndUpdate(req.user.id, req.body, {
        runValidators: true,
        new: true,
    });
    res.status(200).json({
        status: "success",
        user,
    });
}));
exports.deleteMe = (0, asyncErrorHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.default.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({ status: "success", data: null });
}));
