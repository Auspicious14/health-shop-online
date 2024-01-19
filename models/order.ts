import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: { type: String, required: true },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "store",
      required: true,
    },
    cart: { type: Object, ref: "cart" },
    amount: { type: Number, required: String },
    address: { type: Object, required: true },
    status: { type: String, default: "new" },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);
export default orderModel;
