import { Socket } from "socket.io";
import { sendEmail } from "../../../middlewares/email";
import chatModel, { IConnectedClients } from "../../../models/chat";
import StoreModel from "../../../models/store";
import { mapFiles } from "../../../middlewares/file";

export const sendMessage = (
  socket: Socket,
  connectedClients: IConnectedClients[]
) => {
  socket.on("send_message", async (data) => {
    const { storeId, senderId, userId, message, files } = data;
    const store = await StoreModel.findById(storeId).select("-password");
    if (store?._id != storeId) throw new Error("Unauthorised");

    let align = senderId == userId || senderId == storeId ? "right" : "left";
    let images: Array<{}> = [{}];

    if (files) {
      images = await mapFiles(files);
    }

    if (senderId === userId) {
      await chatModel.updateMany(
        { storeId, userId, senderId: storeId, read: false },
        { $set: { read: true } }
      );
    } else if (senderId === storeId) {
      await chatModel.updateMany(
        { storeId, userId, senderId: userId, read: false },
        { $set: { read: true } }
      );
    }

    const newMessage = new chatModel({ ...data, align, read: false, images });
    await newMessage.save();

    const receiverId = senderId == userId ? storeId : userId;
    const receiverClient = connectedClients.find(
      (client) => client.senderId == receiverId
    );

    if (receiverClient) {
      socket.to(receiverClient.socketId).emit("new_message", {
        ...data,
        align,
        createdAt: newMessage.createdAt,
        updatedAt: newMessage.updatedAt,
        read: false,
        images,
      });
    }

    const text = "<div>You have an unread message</div>";
    const mail = await sendEmail(
      store?.email,
      "Incoming Message",
      JSON.stringify(text)
    );
  });
};
