import mongoose from "mongoose";

export interface IImage {
  filename: string;
  originalname: string;
  url: string;
  size: number;
  mimetype: string;
  path: string;
  author: string;
  publishedDate: Date;
}

const requiredMsg = "This is a required field.";
const imageSchema = new mongoose.Schema<IImage>(
  {
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
    publishedDate: { type: Date, required: [true, requiredMsg] },
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);

export default Image;
