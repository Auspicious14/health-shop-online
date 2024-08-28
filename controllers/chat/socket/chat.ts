import { Socket } from "socket.io";
import chatModel from "../../../models/chat";

export const chat = (socket: Socket) => {
  socket.on("chats", async ({ storeId, userId }) => {
    const messages = await chatModel
      .find({ storeId, userId })
      .sort({ createdAt: 1 });

    socket.emit("user_store_messages", messages);
  });
};
