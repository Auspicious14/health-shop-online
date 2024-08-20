import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import { Server, Socket } from "socket.io";
import chatModel from "../../models/chat";

const io = new Server();

export const sendMessage = async (req: Request, res: Response) => {
  const { storeId, userId, message } = req.body;
  try {
    io.emit("send_message", { storeId, userId, message });
    const newMessage = new chatModel({
      storeId,
      userId,
      message,
    });
    await newMessage.save();

    io.emit("new_message", {
      storeId,
      userId,
      message,
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
    console.log(messages, "messages");
    res.json(messages);
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};
