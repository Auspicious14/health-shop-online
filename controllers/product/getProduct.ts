import { Request, Response } from "express";
import productModel from "../../models/products";

const getProducts = async (req: Request, res: Response) => {
  const products = productModel.find();
  res.json({ products });
};

export default getProducts;
