"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const collectionSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "This is a required field."],
        trim: true,
        maxlength: 20,
    },
    images: [{ type: mongoose_1.default.Schema.ObjectId, ref: "Image" }],
    user: { type: mongoose_1.default.Schema.ObjectId, ref: "User" },
}, { timestamps: true });
const Collection = mongoose_1.default.model("Collection", collectionSchema);
exports.default = Collection;
