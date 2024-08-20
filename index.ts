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

export const SocketInit = (httpServer: any, options: any) => {
  const io = new Server(httpServer, options);

  io.on("connection", (socket: Socket) => {
    console.log("A user connected", socket.id);

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
    });
  });
};
