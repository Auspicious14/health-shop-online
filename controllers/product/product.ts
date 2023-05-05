import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import productModel from "../../models/products";
import { mapFiles } from "../../middlewares/file";

export const createProducts = async (req: Request, res: Response) => {
  const { images, ...values } = req.body;
  try {
    const files = await mapFiles(images);
    const product: any = new productModel({ ...values, images: files });
    const data: any = await product.save();
    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
    console.log(error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { images, ...values } = req.body;
  try {
    const files = await mapFiles(images);
    const data: any = await productModel.findByIdAndUpdate(
      id,
      { $set: { ...values, images: files } },
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

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data: any = await productModel.findByIdAndDelete(id);
    if (data) {
      const products = await productModel.find();
      res.json({ data: products, message: "product successfully deleted" });
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  const category = req.query.category;
  const brand = req.query.brand;
  const name = req.query.name;
  const newP = req.query.new;
  const maxPrice = req.query.maxPrice;
  const minPrice = req.query.minPrice;
  const color = req.query.color;
  console.log(req.query);
  try {
    let data: any;
    if (category) {
      data = await productModel
        .find({
          categories: { $in: [category] },
        })
        .exec();
    } else if (newP) {
      data = await productModel.find().sort({ createdAt: -1 }).limit(10).exec();
    } else if (name) {
      data = await productModel.find({ name }).exec();
    } else if (brand) {
      data = await productModel.find({ brand: brand }).exec();
      console.log(data);
    } else if (maxPrice && minPrice) {
      data = await productModel
        .find({ price: { $gte: maxPrice, $lte: minPrice } })
        .exec();
    } else if (color) {
      data = await productModel.find({ color }).exec();
      console.log(data);
    } else {
      data = await productModel.find();
    }

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
