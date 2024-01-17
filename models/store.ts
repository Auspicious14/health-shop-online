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
    description: { type: String },
    // phoneNumber: { type: String, required: true },
    businessNumber: { type: String },
    storePhoneNumber: { type: String, required: true },
    storeAddress: { type: String, required: true },
    whatsAppNumber: { type: String, required: false },
    accepted: { type: Boolean, default: false },
    storeType: { type: String },
    images: [
      {
        uri: { type: String },
        name: { type: String },
        type: { type: String },
      },
    ],
    identificationImage: [
      {
        uri: { type: String },
        name: { type: String },
        type: { type: String },
      },
    ],
    accountType: { type: String },
    socialMedia: [
      {
        platform: { type: String },
        profileName: { type: String },
        profileLink: { type: String },
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
