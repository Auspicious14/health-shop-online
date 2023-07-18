import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    user: { type: Object },
    productId: { type: Schema.Types.ObjectId, ref: "product" },
    title: { type: String, required: true },
    description: { type: String },
    rating: { type: Number },
  },
  { timestamps: true }
);

const reviewModel = mongoose.model("review", reviewSchema);
export default reviewModel;
