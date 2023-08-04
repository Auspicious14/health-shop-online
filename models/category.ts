import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: { type: String },
    images: [
      { uri: { type: String } },
      { name: { type: String } },
      { type: { type: String } },
    ],
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("category", categorySchema);
export default categoryModel;
