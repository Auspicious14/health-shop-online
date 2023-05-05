import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "user" },
  productId: { type: Schema.Types.ObjectId, ref: "product" },
  title: { type: String, required: true },
  description: { type: String },
  rating: { type: String || Number },
});

const reviewModel = mongoose.model("review", reviewSchema);
export default reviewModel;
