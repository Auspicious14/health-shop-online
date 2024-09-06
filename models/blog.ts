import mongoose from "mongoose";
import { IStore } from "./store";
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [
      {
        uri: { type: String },
        name: { type: String },
        type: { type: String },
      },
    ],
    author: { type: Schema.Types.ObjectId, required: true, ref: "store" },
  },
  { timestamps: true }
);

const blogModel = mongoose.model<IBlog>("blog", blogSchema);
export default blogModel;

export interface IBlog {
  _id: string;
  title: string;
  description: string;
  author: IStore;
  createdAt: string;
  updatedAt: string;
  images: IBlogImage[];
}

export interface IBlogImage {
  _id?: string;
  uri: string;
  type: string;
  name: string;
}

export interface IBlogFilter {
  category: string;
  new: string;
  storeId: string;
}
