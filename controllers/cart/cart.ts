import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import cartModel from "../../models/cart";
import productModel from "../../models/products";
import userAuthModel from "../../models/userAuth";

export const AddToCart = async (req: Request, res: Response) => {
  console.log(req.body);
  const { product, userId } = req.body;
  try {
    const id = await userAuthModel.findById({ _id: userId });
    if (!id) return res.json({ success: false, message: "UnAuthorised user" });
    const cart: any = new cartModel({ product, userId: id });
    const { productId } = cart?.product;
    if (productId) {
      const product = await productModel.find({ _id: productId });
      const data = await cart.save();
      console.log(data);
      res.json({ product });
    }
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
