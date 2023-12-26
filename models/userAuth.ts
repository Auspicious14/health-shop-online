const { isEmail } = require("validator");
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userAuthSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: isEmail,
    },
    password: { type: String, required: true, minLength: 6 },
    isAdmin: { type: Boolean, default: false },
    accountType: {
      admin: { type: String },
      storeOwner: { type: String },
      user: { type: String, default: true },
    },
    manageOTP: {
      otp: { type: Number },
      otpDate: { type: Number },
    },
  },
  { timestamps: true }
);

const userAuthModel = mongoose.model("user", userAuthSchema);
export default userAuthModel;
