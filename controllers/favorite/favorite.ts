import { NextFunction, Request, Response } from "express";
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
    const favoriteData = await favoriteModel.findById(data?._id);

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { $set: { addedToFavorite: addToFavorite } },
      { new: true }
    );

    res.json({ success: true, data: favoriteData, product: updatedProduct });
  } catch (error: any) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

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

export const updateFavorite = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const { productId, addToFavorite } = req.body;
  try {
    const product = await productModel.findById(productId);

    if (productId !== product?._id.toString())
      res.json({ success: false, message: "Product not found" });

    const favorite = await favoriteModel.findByIdAndUpdate(
      _id,
      { $set: { productId: product!._id, addToFavorite } },
      { new: true }
    );
    const favoriteData = await favoriteModel.findById(favorite?._id);

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { $set: { addedToFavorite: addToFavorite } },
      { new: true }
    );

    res.json({ success: true, data: favoriteData, product: updatedProduct });
  } catch (error: any) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};
