import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import productModel from "../../models/products";
import { mapFiles } from "../../middlewares/file";
import StoreModel, { IStore } from "../../models/store";
import { ObjectId } from "mongodb";

export const createProducts = async (req: Request, res: Response) => {
  const { storeId, images, ...values } = req.body;
  console.log(req.body);
  try {
    const store: IStore | null = await StoreModel.findById(storeId);
    if (store?._id != storeId)
      return res.status(400).json({ success: false, message: "Unathorized" });

    const files = await mapFiles(images);
    const product: any = new productModel({
      ...values,
      images: files,
      storeId,
    });
    const data: any = await product.save();
    res.json({ data });
  } catch (error) {
    res.json({ error });
    console.log(error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { storeId, images, ...values } = req.body;
  try {
    const store: IStore | null = await StoreModel.findById(storeId);
    if (store?._id != storeId)
      return res.status(400).json({ success: false, message: "Unathorized" });

    const files = await mapFiles(images);
    const data: any = await productModel.findOneAndUpdate(
      { id, storeId },
      { $set: { ...values, images: files, storeId } },
      {
        new: true,
      }
    );
    res.json({ data });
  } catch (error) {
    res.json({ error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { storeId } = req.query;
  try {
    const store: IStore | null = await StoreModel.findById(storeId);
    if (store?._id != storeId)
      return res.status(400).json({ success: false, message: "Unathorized" });

    if (id == "" || !id)
      return res.status(400).json({ success: false, message: "Invalid value" });

    const data: any = await productModel.findOneAndDelete({ _id: id, storeId });
    if (data) {
      res.json({ success: true, message: "Product deleted" });
    }
  } catch (error) {
    res.json({
      success: false,
      error,
    });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  const {
    storeId,
    category,
    brand,
    newArrival,
    name,
    maxPrice,
    minPrice,
    color,
  } = req.query;
  try {
    const store: IStore | null = await StoreModel.findById(storeId);
    if (store?._id != storeId)
      return res.status(400).json({ success: false, message: "Unathorized" });

    let data: any;
    if (category) {
      data = await productModel
        .find({ storeId, categories: { $in: [category] } })
        .exec();
    } else if (newArrival) {
      data = await productModel
        .find({ storeId })
        .sort({ createdAt: -1 })
        .limit(10)
        .exec();
    } else if (name) {
      data = await productModel.find({ storeId, name }).exec();
    } else if (brand) {
      data = await productModel.find({ storeId, brand: brand }).exec();
    } else if (maxPrice && minPrice) {
      data = await productModel
        .find({ storeId, price: { $gte: maxPrice, $lte: minPrice } })
        .exec();
    } else if (color) {
      data = await productModel.find({ storeId, color }).exec();
    } else {
      data = await productModel.find({ storeId });
    }

    res.json({ data });
  } catch (error) {
    res.json({ error });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { storeId } = req.query;
  try {
    const store: IStore | null = await StoreModel.findById(storeId);
    if (store?._id != storeId)
      return res.status(400).json({ success: false, message: "Unathorized" });

    const data: any = await productModel.findOne({ id, storeId });
    if (data._id != id) return res.json({ error: "product not found" });
    console.log(data);
    res.json({ data });
  } catch (error) {
    res.json({ error });
  }
};
