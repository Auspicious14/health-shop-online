import { NextFunction, Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import productModel from "../../models/products";
import favoriteModel from "../../models/favorite";
import mongoose from "mongoose";

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const data = await favoriteModel.find().populate("productId");
    res.json({ success: true, data });
  } catch (error: any) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getOneFavorite = async (req: Request, res: Response) => {
  let { _id } = req.params;
  const id = new mongoose.Types.ObjectId(_id);
  try {
    if (id || id == "") res.json({ success: false, message: "Bad user input" });

    const favorite = await favoriteModel.findById(id).populate("productId");

    if (favorite?._id !== id)
      res.json({ success: false, message: "Bad user input" });

    res.json({ success: true, data: favorite });
  } catch (error: any) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const saveToFavorite = async (req: Request, res: Response) => {
  const { productId, addToFavorite } = req.body;

  try {
    const favorite = await favoriteModel.findOneAndUpdate(
      { productId },
      { $set: { productId, addToFavorite } },
      { new: true, upsert: true }
    );

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { $set: { addedToFavorite: addToFavorite } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: addToFavorite
        ? "Product added to wishlist"
        : "Product removed from wishlist",
      data: favorite,
      product: updatedProduct,
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(500).json({ success: false, errors });
  }
};
