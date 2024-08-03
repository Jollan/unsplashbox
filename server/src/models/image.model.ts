import mongoose from "mongoose";

export interface IImage {
  unsplashId: string;
  filename: string;
  originalname: string;
  url: string;
  size: number;
  width: number;
  height: number;
  mimetype: string;
  path: string;
  author: string;
  profileImageUrl: string;
  publishedDate: Date;
}

const requiredMsg = "This is a required field.";
const imageSchema = new mongoose.Schema<IImage>(
  {
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
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);

export default Image;
