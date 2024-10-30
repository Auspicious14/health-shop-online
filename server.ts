const dotenv = require("dotenv");
dotenv.config();
import express from "express";
const app = express();
const mongoose = require("mongoose");
import { appRoute } from "./index";
import { createServer } from "http";
import { SocketInit } from "./controllers/chat/socket";

const startServer = async () => {
  const port = process.env.PORT || 5000;
  const URI: any = process.env.MONGODB_URL;

  if (!process.env.MONGODB_URL) {
    throw new Error(
      "MONGODB_URL is not set. Unable to connect to the database."
    );
  }
  mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      const httpServer = createServer(app);
      SocketInit(httpServer, { cors: { origin: "*" } });
      httpServer.listen(port, () =>
        console.log(`server is listening on port ${port}`)
      );
    })
    .catch((err: any) => console.log(err));
};

startServer().catch((err) => console.log({ err }));

app.use(appRoute);
