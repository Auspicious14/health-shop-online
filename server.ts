const dotenv = require("dotenv");
dotenv.config();
import express from "express";
const app = express();
const mongoose = require("mongoose");
import { appRoute, SocketInit } from "./index";
import { createServer } from "http";

const port = process.env.PORT || 5000;
const URI: any = process.env.MONGODB_URL;
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

app.use(appRoute);
