import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    product: {
      product: { type: {} },
      quantity: { type: Number, default: 1 },
    },
  },
  { timestamps: true }
);

const cartModel = mongoose.model("cart", cartSchema);
export default cartModel;
