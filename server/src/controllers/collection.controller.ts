import asyncErrorHandler from "../utils/asyncErrorHandler";
import Image from "../models/image.model";
import Collection from "../models/collection.model";

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
  const image = await Image.create(req.body);
  try {
    var collection = await Collection.create({
      ...req.body,
      images: [image],
      user: req.user!._id,
    });
  } catch (error) {
    await Image.findByIdAndDelete(image);
    throw error;
  }
  res.status(201).json({
    status: "success",
    data: { collection },
  });
});
