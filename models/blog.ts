import mongoose from "mongoose";
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [
      { uri: { type: String } },
      { name: { type: String } },
      { type: { type: String } },
    ],
  },
  { timestamps: true }
);

const blogModel = mongoose.model("blog", blogSchema);
export default blogModel;
