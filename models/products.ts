import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    detail: { type: String, required: true },
    image: { type: String, required: true },
    categories: { type: Array },
    price: { type: String, required: true },
    size: { type: String },
    color: { type: String },
  },
  { timestamps: true }
);

const productModel = mongoose.model("product", productSchema);
export default productModel;
