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
    data: { count: collections.length, collections },
  });
});

export const createCollection = asyncErrorHandler(async (req, res) => {
  let image = await newImage(req).save();
  const imagePath = image.path;
  image.path = undefined!;
  try {
    var collection = await Collection.create({
      ...req.body,
      images: [image],
      user: req.user!._id,
    });
  } catch (error) {
    await Image.findByIdAndDelete(image);
    fs.unlink(path.resolve(imagePath), (errot) => {});
    throw error;
  }
  res.status(201).json({
    status: "success",
    data: { collection },
  });
});
