import express, { Request, Response, NextFunction } from "express";
const dotenv = require("dotenv");
dotenv.config();

import router from "./routes/userAuth";
import blogRouter from "./routes/blog";
import cartRouter from "./routes/cart";
import orderRoute from "./routes/order";
import reviewRoute from "./routes/review";
import categoryRoute from "./routes/category";
import StoreRoute from "./routes/store";
import ChatRoute from "./routes/chat";
import { productRouter } from "./routes/product";
import cors from "cors";
const cookieParser = require("cookie-parser");
import { favoriteRouter } from "./routes/favorite";
const favoriteRoute = new favoriteRouter();
const productRoute = new productRouter();

export const appRoute = express();

appRoute.use(cors({ credentials: true }));
appRoute.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow_Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
appRoute.use(express.json({ limit: "50mb" }));
appRoute.use(express.urlencoded({ limit: "50mb", extended: true }));
appRoute.use(cookieParser());
// appRoute.use(express.json());
appRoute.use("/auth", router);
appRoute.use(productRoute.router);
appRoute.use(blogRouter);
appRoute.use(cartRouter);
appRoute.use(orderRoute);
appRoute.use(reviewRoute);
appRoute.use(categoryRoute);
appRoute.use(StoreRoute);
appRoute.use(ChatRoute);
appRoute.use(favoriteRoute.router);

// const sendMessage = (socket: Socket) => {
//   socket.on("send_message", async (data) => {
//     const { storeId, senderId, userId, message } = data;
//     const store = await StoreModel.findById(storeId).select("-password");
//     if (store?._id != storeId) throw new Error("Unauthorised");

//     let align = senderId == userId || senderId == storeId ? "right" : "left";

//     if (senderId === userId) {
//       await chatModel.updateMany(
//         { storeId, userId, senderId: storeId, read: false },
//         { $set: { read: true } }
//       );
//     } else if (senderId === storeId) {
//       await chatModel.updateMany(
//         { storeId, userId, senderId: userId, read: false },
//         { $set: { read: true } }
//       );
//     }

//     const newMessage = new chatModel({ ...data, align, read: false });
//     await newMessage.save();

//     const receiverId = senderId == userId ? storeId : userId;
//     const receiverClient = connectedClients.find(
//       (client) => client.senderId == receiverId
//     );

//     if (receiverClient) {
//       socket.to(receiverClient.socketId).emit("new_message", {
//         ...data,
//         align,
//         createdAt: newMessage.createdAt,
//         updatedAt: newMessage.updatedAt,
//         read: false,
//       });
//     }

//     const text = "<div>You have an unread message</div>";
//     const mail = await sendEmail(
//       store?.email,
//       "Incoming Message",
//       JSON.stringify(text)
//     );
//   });
// };

// const chat = (socket: Socket) => {
//   socket.on("chats", async ({ storeId, userId }) => {
//     const messages = await chatModel
//       .find({ storeId, userId })
//       .sort({ createdAt: 1 });

//     socket.emit("user_store_messages", messages);
//   });
// };

// const markAsRead = (socket: Socket) => {
//   socket.on("mark_as_read", async ({ storeId, userId }) => {
//     await chatModel.updateMany(
//       { storeId, userId, read: false },
//       { $set: { read: true } }
//     );
//   });
// };

// await conversationModel.findOneAndUpdate(
//   { userId, storeId },
//   { lastMessage: message, lastMessageAt: new Date() },
//   { new: true, upsert: true }
// );
