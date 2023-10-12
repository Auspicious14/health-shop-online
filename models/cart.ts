import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    // product: {
    //   // product: { type: {} },
    //   quantity: { type: Number, default: 1 },
    //   amount: { type: Number },
    // },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    quantity: { type: Number, default: 1 },
    amount: { type: Number },
  },
  { timestamps: true }
);

const cartModel = mongoose.model("cart", cartSchema);
export default cartModel;
