import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import cartModel from "../../models/cart";

export const AddToCart = async (req: Request, res: Response) => {
  try {
    const cart: any = new cartModel(req.body);
    const data = await cart.save();
    console.log(data);
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
    res.json({ message: "cart successfully deleted" });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getUserCart = async (req: Request, res: Response) => {
  const id = req.params.userId;
  try {
    const data: any = await cartModel.findOne({ id });
    if (data._id != id) return res.json({ error: "cart not found" });
    console.log(data);
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
