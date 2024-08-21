import mongoose from "mongoose";

const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    message: { type: String },
    storeId: { type: String },
    senderId: { type: String },
    align: { type: String },
    userId: { type: String },
  },
  { timestamps: true }
);

const chatModel = mongoose.model<IChat>("chat", chatSchema);
export default chatModel;

export interface IChat {
  message: string;
  storeId: string;
  senderId: string;
  userId: string;
  align: "right" | "left";
  createdAt: string;
  updatedAt: string;
}
