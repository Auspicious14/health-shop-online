import { Request, Response } from "express";
import productModel from "../../models/products";
import { mapFiles } from "../../middlewares/file";
import StoreModel, { IStore } from "../../models/store";
import categoryModel from "../../models/category";
import { handleErrors } from "../../middlewares/errorHandler";
import mongoose from "mongoose";

export const createProducts = async (req: Request, res: Response) => {
  const { storeId, images, ...values } = req.body;
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
      { _id: id, storeId },
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
    brand,
    newArrival,
    name,
    maxPrice,
    minPrice,
    color,
    slug,
    categories,
    page,
    limit,
  } = req.query;

  let data;
  let categoriesArray: string[] = [];
  let categoryIds: mongoose.Types.ObjectId[] = [];
  const query: any = {};
  const pageNumber = parseInt(page as string) || 1;
  const limitNumber = parseInt(limit as string) || 50;

  const skip = (pageNumber - 1) * limitNumber;

  if (typeof categories === "string") {
    categoriesArray = categories.split(",");
  } else if (Array.isArray(categories)) {
    categoriesArray = categories as string[];
  }

  try {
    if (storeId) {
      const store = await StoreModel.findById(storeId);
      if (!store) {
        return res
          .status(400)
          .json({ success: false, message: "Unauthorized" });
      }
    }

    if (categoriesArray && categoriesArray.length > 0) {
      const categories = await Promise.all(
        categoriesArray.map(async (c) => {
          return await categoryModel.findOne({ name: c });
        })
      );

      categoryIds = categories
        .filter((category) => category !== null)
        .map((category) => category._id);
    }

    if (storeId) query.storeId = storeId;
    if (categoryIds.length > 0) query.categories = { $in: categoryIds };
    if (name) query.name = { $regex: name, $options: "i" };
    if (brand) query.brand = brand;
    if (color) query.color = color;
    if (maxPrice && minPrice) query.price = { $gte: minPrice, $lte: maxPrice };

    if (newArrival == "true") {
      data = await productModel
        .find()
        .populate("categories")
        .sort({ createdAt: -1 })
        .limit(10)
        .exec();
    } else {
      data = await productModel
        .find(query)
        .populate("categories")
        .skip(skip)
        .limit(limitNumber)
        .exec();
    }

    const totalRecords = await productModel.countDocuments(query);

    res.json({ success: true, data: { data, totalRecords } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const slug = req.params.id;
  try {
    const data: any = await productModel
      .findOne({ slug })
      .populate("categories");
    if (data.slug != slug) return res.json({ error: "product not found" });

    res.json({ data });
  } catch (error) {
    res.json({ error });
  }
};

export const getProductsByCategorySlug = async (
  req: Request,
  res: Response
) => {
  const { slug } = req.params;
  try {
    const category = await categoryModel.findOne({ slug });

    if (!category) res.json({ sucess: false, message: "No category matched" });

    const products = await productModel.find({
      categories: { $in: [category!._id] },
    });
    res.json({ success: true, data: products });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

// try {
//   if (storeId) {
//     const store: IStore | null = await StoreModel.findById(storeId);
//     if (store?._id != storeId)
//       return res.status(400).json({ success: false, message: "Unathorized" });
//   }

//   let data: any;
//   if (category) {
//     data = await productModel
//       .find({ storeId, categories: { $in: [category] } })
//       .exec();
//   } else if (newArrival) {
//     data = await productModel
//       .find({ storeId })
//       .sort({ createdAt: -1 })
//       .limit(10)
//       .exec();
//   } else if (name) {
//     data = await productModel.find({ storeId, name }).exec();
//   } else if (brand) {
//     data = await productModel.find({ storeId, brand: brand }).exec();
//   } else if (maxPrice && minPrice) {
//     data = await productModel
//       .find({ storeId, price: { $gte: maxPrice, $lte: minPrice } })
//       .exec();
//   } else if (color) {
//     data = await productModel.find({ storeId, color }).exec();
//   } else if (storeId) {
//     data = await productModel.find({ storeId }).exec();
//   } else {
//     data = await productModel.find();
//   }

//   res.json({ data });
// } catch (error) {
//   res.json({ error });
// }
