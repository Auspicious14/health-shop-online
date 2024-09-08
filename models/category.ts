import mongoose from "mongoose";
import slugify from "slugify";

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: { type: String },
    images: [
      { uri: { type: String } },
      { name: { type: String } },
      { type: { type: String } },
    ],
    slug: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("category", categorySchema);
export default categoryModel;
