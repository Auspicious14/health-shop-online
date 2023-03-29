import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: Array },
    categories: { type: Array },
    price: { type: String, required: true },
    size: { type: String },
    color: { type: String },
    rating: { type: Number },
  },
  { timestamps: true }
);

const productModel = mongoose.model("product", productSchema);
export default productModel;
