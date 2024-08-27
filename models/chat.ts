import mongoose from "mongoose";

const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    message: { type: String },
    storeId: { type: String },
    senderId: { type: String },
    align: { type: String },
    userId: { type: String },
    read: { type: Boolean },
  },
  { timestamps: true }
);

const chatModel = mongoose.model<IChat>("chat", chatSchema);
export default chatModel;

const conversationSchema = new Schema(
  {
    userId: { type: String, required: true },
    storeId: { type: String, required: true },
    lastMessage: { type: String },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const conversationModel = mongoose.model(
  "conversation",
  conversationSchema
);

export interface IChat {
  message: string;
  storeId: string;
  senderId: string;
  userId: string;
  align: "right" | "left";
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IConnectedClients {
  senderId: string;
  role: string;
  socketId: string;
  userId: string;
  storeId: string;
}
