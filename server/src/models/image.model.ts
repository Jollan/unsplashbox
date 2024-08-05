import mongoose from "mongoose";

export interface IImage {
  unsplashId: string;
  filename: string;
  url: string;
  width: number;
  height: number;
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
    url: {
      type: String,
      required: [true, requiredMsg],
      trim: true,
    },
    width: {
      type: Number,
      required: [true, requiredMsg],
    },
    height: {
      type: Number,
      required: [true, requiredMsg],
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
