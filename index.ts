const dotenv = require("dotenv");
dotenv.config();
import router from "./routes/userAuth";
import productRouter from "./routes/product";
const cookieParser = require("cookie-parser");
import express from "express";
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const URI = process.env.MONGODB_URL;
mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(port, () => console.log(`server is listening on port ${port}`))
  );
app.use(cookieParser());
app.use(express.json());
app.use("/auth", router);
app.use(productRouter);
