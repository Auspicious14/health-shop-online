import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import productModel from "../../models/products";

export const createProducts = async (req: Request, res: Response) => {
  // const { name, description, image, color } = req.body;

  try {
    const product: any = new productModel(req.body);
    const data: any = await product.save();
    console.log(data);
    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    console.log(id, "iddddddddddd");
    const data: any = await productModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
      }
    );
    console.log(data);
    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data: any = await productModel.findByIdAndDelete({ id });
    res.json({ message: "product successfully deleted" });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};
export const getProducts = async (req: Request, res: Response) => {
  try {
    const data: any = await productModel.find();
    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data: any = await productModel.findById(id);
    if (data._id != id) return res.json({ error: "product not found" });
    console.log(data);
    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};
