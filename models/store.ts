import mongoose, { Document } from "mongoose";
const { isEmail } = require("validator");
const Schema = mongoose.Schema;

export const StoreSchema = new Schema(
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
    bankCode: { type: String },
    recipientCode: { type: String },
    password: { type: String, required: true, minLength: 6 },
  },
  { timestamps: true }
);

const StoreModel = mongoose.model<IStore>("store", StoreSchema);
export default StoreModel;

export interface IStore extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  whatsAppNumber: string;
  storePhoneNumber: string;
  description: string;
  storeName: string;
  accepted: boolean;
  policy: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankCode: string;
  recipientCode: string;
  storeType: string;
  businessNumber: string;
  storeAddress: string;
  socialMedia: IStoreSocialMedia[];
  images: IStoreFile[];
  identificationImage: IStoreFile[];
  createdAt: string;
  updatedAt: string;
  accountType: string;
  password: string;
}

export interface IStoreFile {
  uri: string;
  name: string;
  type: string;
}

export interface IStoreSocialMedia {
  platform: string;
  profileName: string;
  profileLink: string;
}
