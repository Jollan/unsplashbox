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
exports.createCollection = exports.getCollections = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const asyncErrorHandler_1 = __importDefault(require("../utils/asyncErrorHandler"));
const image_model_1 = __importDefault(require("../models/image.model"));
const collection_model_1 = __importDefault(require("../models/collection.model"));
const image_controller_1 = require("./image.controller");
exports.getCollections = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collections = yield collection_model_1.default.find({ user: req.user }).populate("images");
    res.status(200).json({
        status: "success",
        data: { count: collections.length, collections },
    });
}));
exports.createCollection = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let image = yield (0, image_controller_1.newImage)(req).save();
    const imagePath = image.path;
    image.path = undefined;
    try {
        var collection = yield collection_model_1.default.create(Object.assign(Object.assign({}, req.body), { images: [image], user: req.user._id }));
    }
    catch (error) {
        yield image_model_1.default.findByIdAndDelete(image);
        fs_1.default.unlink(path_1.default.resolve(imagePath), (errot) => { });
        throw error;
    }
    res.status(201).json({
        status: "success",
        data: { collection },
    });
}));
