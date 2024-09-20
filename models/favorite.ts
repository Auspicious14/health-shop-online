import mongoose from "mongoose";

const Schema = mongoose.Schema;

const favoriteSchema = new Schema(
  {
    addToFavorite: { type: Boolean, default: false },
    productId: { type: mongoose.Types.ObjectId, ref: "product" },
    // name: { type: String },
  },
  { timestamps: true }
);

const favoriteModel = mongoose.model("favorite", favoriteSchema);
export default favoriteModel;
