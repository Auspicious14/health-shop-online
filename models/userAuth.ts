const { isEmail } = require("validator");
import dotenv from "dotenv";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

dotenv.config();
const userRoleNumber = process.env.USER_ROLE_NUMBER;
const adminRoleNumber = process.env.ADMIN_ROLE_NUMBER;
const employeeRoleNumber = process.env.EMPLOYEE_ROLE_NUMBER;

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
  },
  { timestamps: true }
);

const userAuthModel = mongoose.model("user", userAuthSchema);
export default userAuthModel;
