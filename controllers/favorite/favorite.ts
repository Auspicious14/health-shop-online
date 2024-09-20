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
