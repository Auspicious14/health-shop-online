import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import cartModel from "../../models/cart";
import productModel from "../../models/products";
import mongoose, { AnyArray } from "mongoose";

export const AddToCart = async (req: Request, res: Response) => {
  const { productId: id, userId, quantity } = req.body;
  console.log(req.body);
  try {
    const productt: any = await productModel.findById(id);
    const amount = quantity * parseFloat(productt.price);
    console.log(productt, "amounttt");
    if (!userId) return res.status(401).json({ error: "unauthorised" });
    const cart: any = new cartModel({
      productId: id,
      amount,
      quantity,
      userId,
    });
    const data = await cart.save();
    console.log(data);
    res.json({ data: { productt, data } });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const updateCart = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { quantity, productId: _id } = req.body;
  console.log(req.body);
  try {
    const productt: any = await productModel.findById(_id);
    const amount = quantity * parseFloat(productt.price);
    const data: any = await cartModel.findById(id);
    data.quantity = quantity;
    data.amount = amount;
    await data.save();
    res.json({ productt, data });
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
      res.json({ data, message: "cart successfully deleted" });
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getUserCart = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    // const cart: any = await cartModel.find({ userId: userId });
    // console.log(cart, "cart with content");
    // console.log(cart, "carttttt");
    // const data = await Promise.all(
    //   cart.map(async (c: any) => {
    //     const product = await productModel.findById(c?.productId);
    //     c.product = product;
    //     console.log(product, "producttt");
    //     console.log(c, "cart returned");
    //     return c;
    //   })
    // );

    const data = await cartModel
      .aggregate([
        {
          $match: { userId: userObjectId },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            amount: 1,
            quantity: 1,
            createdAt: 1,
            updatedAt: 1,
            productId: 1,
            product: 1,
          },
        },
      ])
      .exec();

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

export const emptyCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cart = await cartModel.find({ userId: id });
    if (cart) {
      await cartModel.deleteMany({ userId: id });
      const data = await cartModel.find();
      res.json({ data, message: "cart is empty" });
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};
