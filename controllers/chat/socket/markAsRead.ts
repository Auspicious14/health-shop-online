import { Socket } from "socket.io";
import chatModel from "../../../models/chat";

export const markAsRead = (socket: Socket) => {
  socket.on("mark_as_read", async ({ storeId, userId }) => {
    await chatModel.updateMany(
      { storeId, userId, read: false },
      { $set: { read: true } }
    );
  });
};
