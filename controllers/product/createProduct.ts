import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import productModel from "../../models/products";

const createProducts = async (req: Request, res: Response) => {
  const { name, description, image, color } = req.body;

  try {
    const product: any = await productModel.create({
      name,
      description,
      image,
      color,
    });

    console.log(product);
    res.json({ product });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export default createProducts;
