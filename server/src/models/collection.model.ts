import mongoose from "mongoose";

export interface ICollection {
  name: string;
  images: mongoose.Types.ObjectId[];
  user: mongoose.Types.ObjectId;
}

const collectionSchema = new mongoose.Schema<ICollection>(
  {
    name: {
      type: String,
      required: [true, "This is a required field."],
      trim: true,
      maxlength: 20,
    },
    images: [{ type: mongoose.Schema.ObjectId, ref: "Image" }],
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Collection = mongoose.model("Collection", collectionSchema);

export default Collection;
