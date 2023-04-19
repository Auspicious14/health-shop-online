import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import cartModel from "../../models/cart";
import productModel from "../../models/products";

export const AddToCart = async (req: Request, res: Response) => {
  console.log(req.body);
  const { product, userId } = req.body;
  const { id, quantity } = product;
  try {
    const productt = await productModel.findById(id);
    const cart: any = new cartModel({
      product: { product: productt, quantity },
      userId,
    });
    const data = await cart.save();
    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const updateCart = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data: any = await cartModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
      }
    );
    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const deleteCart = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data: any = await cartModel.findByIdAndDelete(id);
    if (data) {
      res.json({ message: "cart successfully deleted" });
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getUserCart = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const data: any = await cartModel.find({ userId: userId }).exec();
    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getAllUserCart = async (req: Request, res: Response) => {
  try {
    const data: any = cartModel.find();
    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};
