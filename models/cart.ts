import mongoose, { Document } from "mongoose";
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
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

const cartModel = mongoose.model<ICart>("cart", cartSchema);
export default cartModel;

export interface ICart extends Document {
  userId?: string;
  amount?: number;
  productId: string;
  quantity: number;
}
