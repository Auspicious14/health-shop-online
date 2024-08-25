const dotenv = require("dotenv");
dotenv.config();

import router from "./routes/userAuth";
import productRouter from "./routes/product";
import blogRouter from "./routes/blog";
import cartRouter from "./routes/cart";
import orderRoute from "./routes/order";
import reviewRoute from "./routes/review";
import categoryRoute from "./routes/category";
import StoreRoute from "./routes/store";
import ChatRoute from "./routes/chat";
const cookieParser = require("cookie-parser");
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import { Server, Socket } from "socket.io";
import chatModel, { IConnectedClients } from "./models/chat";
import StoreModel from "./models/store";
import { sendEmail } from "./middlewares/email";

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
appRoute.use(productRouter);
appRoute.use(blogRouter);
appRoute.use(cartRouter);
appRoute.use(orderRoute);
appRoute.use(reviewRoute);
appRoute.use(categoryRoute);
appRoute.use(StoreRoute);
appRoute.use(ChatRoute);

const connectedClients: IConnectedClients[] = [];

export const SocketInit = (httpServer: any, options: any) => {
  const io = new Server(httpServer, options);

  io.on("connection", (socket: Socket) => {
    console.log("A user connected", socket.id);

    socket.on(
      "register_client",
      ({ senderId, role }: { senderId: string; role: string }) => {
        connectedClients.push({ senderId, role, socketId: socket.id });
      }
    );

    socket.on("chats", async ({ storeId, userId }) => {
      const messages = await chatModel
        .find({ storeId, userId })
        .sort({ createdAt: 1 });
      socket.emit("all_messages", messages);
    });

    socket.on("send_message", async (data) => {
      const { storeId, senderId, userId, message } = data;
      const store = await StoreModel.findById(storeId).select("-password");
      if (store?._id != storeId) throw new Error("Unauthorised");

      let align = senderId == userId || senderId == storeId ? "right" : "left";

      const newMessage = new chatModel({ ...data, align });
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
        });
      }
      const text = "<div>You have an unread message</div>";
      const mail = await sendEmail(
        store?.email,
        "Incoming Message",
        JSON.stringify(text)
      );
      console.log(mail, "mailll");

      // io.emit("new_message", {
      //   ...data,
      //   align,
      //   createdAt: newMessage.createdAt,
      //   udpdatedAt: newMessage.updatedAt,
      // });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      const index = connectedClients.findIndex(
        (client) => client.socketId === socket.id
      );
      if (index !== -1) connectedClients.splice(index, 1);
    });
  });
};
