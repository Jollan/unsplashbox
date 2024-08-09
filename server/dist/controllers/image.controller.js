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
exports.getImage = exports.setResourcePolicy = exports.search = exports.removeImage = exports.createImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
const axios_1 = __importDefault(require("axios"));
const asyncErrorHandler_1 = __importDefault(require("../utils/asyncErrorHandler"));
const image_model_1 = __importDefault(require("../models/image.model"));
const customError_1 = __importDefault(require("../utils/customError"));
const collection_model_1 = __importDefault(require("../models/collection.model"));
exports.createImage = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield collection_model_1.default.findById(req.params.collectionId);
    if (!collection) {
        throw new customError_1.default("The collection does not exist.", 404);
    }
    const image = yield image_model_1.default.create(req.body);
    collection.images.push(image._id);
    collection.save({ validateBeforeSave: false });
    res.status(201).json({
        status: "success",
        data: { image },
    });
}));
exports.removeImage = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield collection_model_1.default.findById(req.params.collectionId).populate("images");
    if (!collection) {
        throw new customError_1.default("The collection does not exist.", 404);
    }
    const image = collection.images.find(({ unsplashId }) => {
        return unsplashId === req.params.unsplashId;
    });
    if (!image) {
        throw new customError_1.default("The image does not exist on the collection.", 404);
    }
    yield image_model_1.default.findByIdAndDelete(image);
    collection.images = collection.images.filter(({ unsplashId }) => {
        return unsplashId !== image.unsplashId;
    });
    if (!collection.images.length)
        yield collection_model_1.default.findByIdAndDelete(collection);
    else
        collection.save({ validateBeforeSave: false });
    res.status(204).json({
        status: "success",
        data: null,
    });
}));
exports.search = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { query, page } = req.query;
    [query, page] = [query === null || query === void 0 ? void 0 : query.trim(), +(page === null || page === void 0 ? void 0 : page.trim()) || 1];
    if (!query) {
        throw new customError_1.default("Do not know what search for.", 404);
    }
    const params = `query=${query}&page=${page}&per_page=30`;
    const result = yield axios_1.default.get(`https://api.unsplash.com/search/photos?${params}`, {
        headers: { Authorization: `Client-ID ${process.env.ACCESS_KEY}` },
    });
    res.status(200).json({
        status: "success",
        data: result.data,
    });
}));
const setResourcePolicy = (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
};
exports.setResourcePolicy = setResourcePolicy;
exports.getImage = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { ids, width, height } = req.query;
    [ids, width, height] = [ids === null || ids === void 0 ? void 0 : ids.trim(), +(width === null || width === void 0 ? void 0 : width.trim()), +(height === null || height === void 0 ? void 0 : height.trim())];
    if (!ids || !width || !height) {
        throw new customError_1.default("Missing some info. Perhaps <ids> or <height> or <width>.", 404);
    }
    // Sanitization
    let imgIds = ids
        .split(",")
        .splice(0, 3)
        .map((id) => id.trim())
        .filter((id) => id);
    const images = yield image_model_1.default.find({ _id: { $in: imgIds } });
    if (!images.length) {
        throw new customError_1.default("No image detected.", 404);
    }
    const [, img2, img3] = images;
    let [w, h, top, bottom, left, right] = [width, height, ...[0, 0, 0, 0]];
    const imageBuffers = [];
    let outputBuffer;
    // Get buffers
    for (let index = 0; index < images.length; index++) {
        const buffer = yield axios_1.default.get(images[index].url, {
            responseType: "arraybuffer",
        });
        imageBuffers.push(buffer.data);
    }
    const resizedBuffers = imageBuffers.map((buffer, index) => {
        // Initialize sizes accordingly to image count
        if (img2 || img3) {
            if (index === 0) {
                [w, h, top, bottom, left, right] = [
                    width * (img3 ? 0.75 : 0.5),
                    height,
                    ...[0, 0, 0, 2],
                ];
            }
            else {
                [w, h, top, bottom, left, right] = [
                    width * (img3 ? 0.25 : 0.5),
                    height * (img3 ? 0.5 : 1),
                    ...(index === 1 && img3 ? [0, 2, 0, 0] : [0, 0, 0, 0]),
                ];
            }
        }
        // Resize
        let image = (0, sharp_1.default)(buffer).resize(w - (left + right), h - (top + bottom));
        // Put borders if necessary
        if (img2 || img3) {
            image = image.extend({
                top,
                bottom,
                left,
                right,
                background: { r: 255, g: 255, b: 255, alpha: 1 },
            });
        }
        return image.toBuffer();
    });
    if (resizedBuffers.length === 1)
        outputBuffer = yield resizedBuffers[0];
    else {
        // Only if there is more than one image
        const imagesToComposite = [
            { input: yield resizedBuffers[0], top: 0, left: 0 },
            {
                input: yield resizedBuffers[1],
                top: 0,
                left: width * (img3 ? 0.75 : 0.5),
            },
        ];
        // If it's 3 images
        if (img3) {
            imagesToComposite.push({
                input: yield resizedBuffers[2],
                top: height * 0.5,
                left: width * 0.75,
            });
        }
        outputBuffer = yield (0, sharp_1.default)({
            create: {
                width,
                height,
                channels: 3,
                background: { r: 255, g: 255, b: 255 },
            },
        })
            .jpeg()
            .composite(imagesToComposite)
            .toBuffer();
    }
    res.status(200).type("image/jpeg").send(outputBuffer);
}));
