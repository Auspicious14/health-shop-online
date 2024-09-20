import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import productModel from "../../models/products";
import favoriteModel from "../../models/favorite";
import mongoose from "mongoose";

export const addToFavorite = async (req: Request, res: Response) => {
  const { productId, addToFavorite } = req.body;
  try {
    const product = await productModel.findById(productId);

    if (productId !== product?._id.toString())
      res.json({ success: false, message: "Product not found" });

    const favorite = new favoriteModel({ productId, addToFavorite });
    const data = await favorite.save();

    res.json({ success: true, data });
  } catch (error: any) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const data = await favoriteModel.find();
    res.json({ success: true, data });
  } catch (error: any) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getOneFavorites = async (req: Request, res: Response) => {
  let { _id } = req.params;
  const id = new mongoose.Types.ObjectId(_id);
  try {
    if (id || id == "")
      return res.json({ success: false, message: "Bad user input" });

    const favorite = await favoriteModel.findById(id);

    if (favorite?._id !== id)
      return res.json({ success: false, message: "Bad user input" });

    res.json({ success: true, data: favorite });
  } catch (error: any) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const updateFavorite = async (req: Request, res: Response) => {
  const { _id, productId, addToFavorite } = req.body;
  try {
    const product = await productModel.findById(productId);

    if (productId !== product?._id.toString())
      res.json({ success: false, message: "Product not found" });

    const favorite = await favoriteModel.findByIdAndUpdate(
      _id,
      { $set: { productId: product!._id, addToFavorite } },
      { new: true }
    );

    res.json({ success: true, data: favorite });
  } catch (error: any) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};
