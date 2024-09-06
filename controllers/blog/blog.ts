const dotenv = require("dotenv");
dotenv.config();
import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import blogModel from "../../models/blog";
import { mapFiles, IFile } from "../../middlewares/file";
import StoreModel from "../../models/store";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const createBlog = async (req: Request, res: Response) => {
  const { title, description, images, storeId } = req.body;

  try {
    const store = await StoreModel.findById(storeId).select("-password");
    if (!store) return res.json({ success: false, message: "Unauthorised" });

    const files: IFile[] = await mapFiles(images);
    const blog = new blogModel({
      title,
      description,
      images: files,
      author: store?._id,
    });
    const data = await blog.save();
    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const updateblog = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { images, storeId, ...vals } = req.body;
  try {
    const store = await StoreModel.findById(storeId).select("-password");
    if (!store) return res.json({ success: false, message: "Unauthorised" });

    let files = await mapFiles(images);

    if (!files)
      return res.json({ error: "Error uploading image to cloudinary" });
    const data: any = await blogModel.findByIdAndUpdate(
      id,
      { $set: { ...vals, images: files, storeId } },
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

export const deleteblog = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data: any = await blogModel.findByIdAndDelete(id);
    if (data) {
      const blogs = await blogModel.find();
      res.json({ data: blogs, message: "blog successfully deleted" });
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getblogs = async (req: Request, res: Response) => {
  const { name, category, new: latestBlogs, storeId } = req.query;

  try {
    let data: any;
    let query: any = {};

    if (category) query.category = { $in: [category] };
    if (name) query.name = name;
    if (storeId) query.storeId = storeId;

    if (latestBlogs) {
      data = await blogModel
        .find()
        .populate("author")
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(10);
    } else {
      data = await blogModel.find(query).populate("author").select("-password");
    }

    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getOneblog = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data: any = await blogModel
      .findById(id)
      .populate("author")
      .select("-password");
    if (data._id != id) return res.json({ error: "blog not found" });

    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};
