import mongoose from "mongoose";

const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    message: { type: String },
    storeId: { type: String },
    userId: { type: String },
  },
  { timestamps: true }
);

const chatModel = mongoose.model<IChat>("chat", chatSchema);
export default chatModel;

export interface IChat {
  message: string;
  storeId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
