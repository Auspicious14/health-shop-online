import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import { Server, Socket } from "socket.io";
import chatModel from "../../models/chat";
import StoreModel from "../../models/store";
import { sendEmail } from "../../middlewares/email";

const io = new Server();

export const sendMessage = async (req: Request, res: Response) => {
  const { storeId, userId, message, senderId } = req.body;

  try {
    const store = await StoreModel.findById(storeId).select("-password");
    if (store?._id != storeId) return res.json({ message: "Unauthorised" });

    let align: string;
    align = senderId == userId ? "right" : "left";
    align = senderId == storeId ? "right" : "left";

    io.emit("send_message", { storeId, userId, message, senderId, align });
    const newMessage = new chatModel({
      storeId,
      userId,
      message,
      senderId,
      align,
    });
    await newMessage.save();

    const text = "You have unread message";
    await sendEmail(store?.email, "Incoming Message", text);

    io.emit("new_message", {
      storeId,
      userId,
      message,
      senderId,
      align,
      createdAt: newMessage.createdAt,
      updatedAt: newMessage.updatedAt,
    });

    res.json({
      success: true,
      message: "Message sent and broadcasted successfully.",
      data: newMessage,
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const { storeId, userId } = req.query;

  try {
    let query: any;

    if (storeId) query.storeId = storeId;
    if (userId) query.userId = userId;

    const messages = await chatModel.find();
    res.json(messages);
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};
