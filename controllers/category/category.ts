import { Request, Response } from "express";
import categoryModel from "../../models/category";
import { handleErrors } from "../../middlewares/errorHandler";
import userAuthModel from "../../models/userAuth";
import { mapFiles } from "../../middlewares/file";

export const createCategory = async (req: Request, res: Response) => {
  const { name, images } = req.body;

  try {
    const files = await mapFiles(images);
    const catName = await categoryModel.findOne({ name }).exec();
    if (catName)
      return res
        .status(409)
        .json({ success: false, message: "Category name already exist" });
    const data: any = await categoryModel.create({
      name,
      images: files,
    });
    res.json({
      success: true,
      message: "category created",
      data,
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({
      success: false,
      message: errors,
    });
  }
};

export const updatecategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, images } = req.body;
  try {
    let files = images;
    if (images) {
      files = await mapFiles(images);
    }
    const data: any = await categoryModel.findByIdAndUpdate(
      id,
      {
        $set: { name, images: files },
      },
      { new: true }
    );

    if (!data) res.json({ success: false, message: "Error updating category" });

    res.json({
      success: true,
      message: "category Updated",
      data,
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({
      success: false,
      message: errors,
    });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    let data = await categoryModel.findOne({ slug });
    if (!data) res.json({ success: false, message: "category not found" });

    res.json({
      success: true,
      message: "Success",
      data,
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({
      success: false,
      message: errors,
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (id == "" || !id)
      return res.status(400).json({ success: false, message: "Invalid value" });

    const del = await categoryModel.findByIdAndDelete(id);
    if (del) res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({
      success: false,
      message: { errors, error },
    });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    let data = await categoryModel.find();
    if (!data) res.json({ success: false, message: "category not found" });

    res.json({
      success: true,
      message: "Success",
      data,
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({
      success: false,
      message: { errors, error },
    });
  }
};
