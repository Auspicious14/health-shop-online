import mongoose from "mongoose";
const { isEmail } = require("validator");
const Schema = mongoose.Schema;

const StoreSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    storeName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: isEmail,
    },
    // phoneNumber: { type: String, required: true },
    storePhoneNumber: { type: String, required: true },
    storeAddress: { type: String, required: true },
    whatsAppNumber: { type: String, required: false },
    accepted: { type: Boolean, default: false },
    industryType: { type: String },
    images: [
      {
        uri: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
      },
    ],
    identificationImage: [
      {
        uri: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
      },
    ],
    socialMedia: [
      {
        name: { type: String },
        link: { type: String },
      },
    ],
    policy: { type: String },
    bankName: { type: String },
    bankAccountNumber: { type: String },
    bankAccountName: { type: String },
    password: { type: String, required: true, minLength: 6 },
  },
  { timestamps: true }
);

const StoreModel = mongoose.model("store", StoreSchema);
export default StoreModel;
