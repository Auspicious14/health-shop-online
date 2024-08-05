import mongoose, { Document } from "mongoose";
import { ICart } from "./cart";
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: { type: String, required: true },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "store",
      // required: true,
    },
    cart: { type: Object, ref: "cart" },
    amount: { type: Number, required: String },
    address: { type: Object, required: true },
    status: { type: String, default: "new" },
  },
  { timestamps: true }
);

const orderModel = mongoose.model<IOrder>("order", orderSchema);
export default orderModel;

export interface IOrder extends Document {
  _id: string;
  userId: string;
  cart: ICart[];
  amount: number;
  address: IAddress;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAddress {
  name: string;
  email: string;
  phoneNumber: string;
  postalCode: string;
  city: string;
  address: string;
}
