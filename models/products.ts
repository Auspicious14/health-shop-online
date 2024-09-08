import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import slugify from "slugify";
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "store",
      // required: true,
    },
    images: [
      { uri: { type: String }, name: { type: String }, type: { type: String } },
    ],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "category" }],
    price: { type: String, required: true },
    quantity: { type: String },
    soldout: { type: String, default: false },
    availability: { type: String },
    brand: { type: String },
    size: { type: String },
    color: { type: String },
    rating: { type: Number },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("product", productSchema);
export default productModel;
