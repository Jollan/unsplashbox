import fs from "fs";
import path from "path";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import Image from "../models/image.model";
import Collection from "../models/collection.model";
import { newImage } from "./image.controller";

export const getCollections = asyncErrorHandler(async (req, res) => {
  const collections = await Collection.find({ user: req.user }).populate(
    "images"
  );
  res.status(200).json({
    status: "success",
    data: { collections },
  });
});

export const createCollection = asyncErrorHandler(async (req, res) => {
  const image = await newImage(req).save();
  try {
    var collection = await Collection.create({
      ...req.body,
      images: [image._id],
      user: req.user!._id,
    });
  } catch (error) {
    await Image.findByIdAndDelete(image);
    fs.unlinkSync(path.resolve(image.path));
    throw error;
  }
  res.status(201).json({
    status: "success",
    data: { collection },
  });
});
