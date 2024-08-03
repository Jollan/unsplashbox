"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const requiredMsg = "This is a required field.";
const imageSchema = new mongoose_1.default.Schema({
    unsplashId: {
        type: String,
        required: [true, requiredMsg],
        trim: true,
    },
    filename: {
        type: String,
        required: [true, requiredMsg],
        trim: true,
    },
    originalname: {
        type: String,
        required: [true, requiredMsg],
        trim: true,
    },
    url: {
        type: String,
        required: [true, requiredMsg],
        trim: true,
    },
    size: Number,
    mimetype: String,
    width: {
        type: Number,
        required: [true, requiredMsg],
    },
    height: {
        type: Number,
        required: [true, requiredMsg],
    },
    path: {
        type: String,
        required: [true, requiredMsg],
        trim: true,
        select: false,
    },
    author: {
        type: String,
        required: [true, requiredMsg],
        trim: true,
    },
    profileImageUrl: {
        type: String,
        required: [true, requiredMsg],
        trim: true,
    },
    publishedDate: { type: Date, required: [true, requiredMsg] },
}, { timestamps: true });
const Image = mongoose_1.default.model("Image", imageSchema);
exports.default = Image;
