import path from "path";
import util from "util";
import fs from "fs";
import multer from "multer";
import sharp from "sharp";
import axios from "axios";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import Image from "../models/image.model";
import CustomError from "../utils/customError";
import Collection from "../models/collection.model";
import { assign } from "lodash";

const storage = multer.diskStorage({
  destination(req: any, file, cb) {
    const dirName = `uploads/images/${req.user.id}`;
    const dirPath = path.join(path.resolve(__dirname, "../../"), dirName);
    fs.mkdir(dirPath, { recursive: true }, (error) => {
      cb(error, dirName);
    });
  },
  filename(req, file, cb) {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${unique}${path.extname(file.originalname)}`);
  },
});

const multerConfig = multer({
  storage,
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      cb(new CustomError("The file is not image.", 400));
      return;
    }
    cb(null, true);
  },
});

export const upload = asyncErrorHandler(
  util.promisify(multerConfig.single("image"))
);

export function newImage(req: any) {
  const protocol = req.get("X-Forwarded-Proto") || req.protocol;
  const baseUrl = `${protocol}://${req.get("host")}`;
  const url = `${baseUrl}/images/${req.user!.id}/${req.file.filename}`;
  const image = new Image({ ...req.body, ...req.file, url });
  return image;
}

export const createImage = asyncErrorHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.collectionId);
  if (!collection) {
    throw new CustomError("The collection does not exist.", 404);
  }
  const image = await newImage(req).save();
  collection.images.push(image._id);
  collection.save({ validateBeforeSave: false });
  image.path = undefined!;

  res.status(201).json({
    status: "success",
    data: { image },
  });
});

export const removeImage = asyncErrorHandler(async (req, res) => {
  const collection = await Collection.findById(
    req.params.collectionId
  ).populate<{ images: InstanceType<typeof Image>[] }>("images");

  if (!collection) {
    throw new CustomError("The collection does not exist.", 404);
  }
  const image = collection.images.find(({ unsplashId }) => {
    return unsplashId === req.params.unsplashId;
  });
  if (!image) {
    throw new CustomError("The image does not exist on the collection.", 404);
  }
  const delImage = await Image.findByIdAndDelete(image).select("+path");
  if (delImage) {
    fs.unlink(path.resolve(delImage.path), (error) => {});
  }
  collection.images = collection.images.filter(({ unsplashId }) => {
    return unsplashId !== image.unsplashId;
  });
  if (!collection.images.length) await Collection.findByIdAndDelete(collection);
  else collection.save({ validateBeforeSave: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const search = asyncErrorHandler(async (req, res) => {
  let { query, page } = req.query as any;
  [query, page] = [query?.trim(), +page?.trim() || 1];
  if (!query) {
    throw new CustomError("Do not know what search for.", 404);
  }
  const params = `query=${query}&page=${page}&per_page=30`;
  const result = await axios.get(
    `https://api.unsplash.com/search/photos?${params}`,
    {
      headers: { Authorization: `Client-ID ${process.env.ACCESS_KEY}` },
    }
  );
  const { results } = result.data;
  for (let index = 0; index < results.length; index++) {
    const image = results[index];
    const buffer = await axios.get(image.urls.small, {
      responseType: "arraybuffer",
    });
    assign(image, await sharp(buffer.data).metadata());
  }
  res.status(200).json({
    status: "success",
    data: result.data,
  });
});

export const setResourcePolicy = (req: any, res: any, next: any) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
};
export const getImage = asyncErrorHandler(async (req, res) => {
  let { ids, width, height } = req.query as any;
  [ids, width, height] = [ids?.trim(), +width?.trim(), +height?.trim()];
  if (!ids || !width || !height) {
    throw new CustomError(
      "Missing some info. Perhaps <ids> or <height> or <width>.",
      404
    );
  }

  // Sanitization
  let imgIds = ids
    .split(",")
    .splice(0, 3)
    .map((id: string) => id.trim())
    .filter((id: string) => id);

  const images = await Image.find({ _id: { $in: imgIds } }).select("+path");
  if (!images.length) {
    throw new CustomError("No image detected.", 404);
  }

  const [, img2, img3] = images;
  let [w, h, top, bottom, left, right] = [width, height, ...[0, 0, 0, 0]];
  let buffer: Buffer;

  const resizedBuffers = images.map((image, index) => {
    // Initialize sizes accordingly to image count
    if (img2 || img3) {
      if (index === 0) {
        [w, h, top, bottom, left, right] = [
          width * (img3 ? 0.75 : 0.5),
          height,
          ...[0, 0, 0, 1],
        ];
      } else {
        [w, h, top, bottom, left, right] = [
          width * (img3 ? 0.25 : 0.5),
          height * (img3 ? 0.5 : 1),
          ...(index === 1 && img3 ? [0, 1, 0, 0] : [0, 0, 0, 0]),
        ];
      }
    }
    // Resize
    let img = sharp(path.resolve(image.path)).resize(
      w - (left + right),
      h - (top + bottom)
    );
    // Put borders if necessary
    if (img2 || img3) {
      img = img.extend({
        top,
        bottom,
        left,
        right,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      });
    }
    return img.png().toBuffer();
  });

  if (resizedBuffers.length === 1) buffer = await resizedBuffers[0];
  else {
    // Only if there is more than one image
    const imagesToComposite = [
      { input: await resizedBuffers[0], top: 0, left: 0 },
      {
        input: await resizedBuffers[1],
        top: 0,
        left: width * (img3 ? 0.75 : 0.5),
      },
    ];
    // If it's 3 images
    if (img3) {
      imagesToComposite.push({
        input: await resizedBuffers[2],
        top: height * 0.5,
        left: width * 0.75,
      });
    }

    buffer = await sharp({
      create: {
        width,
        height,
        channels: 3,
        background: { r: 255, g: 255, b: 255 },
      },
    })
      .png()
      .composite(imagesToComposite)
      .toBuffer();
  }
  res.status(200).type("image/png").send(buffer);
});
