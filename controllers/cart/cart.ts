import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import cartModel from "../../models/cart";
import productModel from "../../models/products";
import userAuthModel from "../../models/userAuth";

export const AddToCart = async (req: Request, res: Response) => {
  console.log(req.body);
  const { product, userId } = req.body;
  const { id, quantity } = product;
  try {
    // const id = await userAuthModel.findById({ _id: userId });
    // if (!id) return res.json({ success: false, message: "UnAuthorised user" });
    const productt = await productModel.findById(id);
    const cart: any = new cartModel({
      product: { product: productt, quantity },
      userId,
    });
    // const { productId } = cart?.product;
    const data = await cart.save();
    console.log(data);
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
    res.json({ message: "cart successfully deleted" });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getUserCart = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const data: any = await cartModel.find({ userId: userId }).exec();
    // if (data.userId != userId) return res.json({ error: "cart not found" });
    console.log(data, "cartttt");
    // const product = await productModel.findById({
    //   _id: data.product.productId,
    // });
    res.json({ data });
    // console.log(data, "producttt");
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
