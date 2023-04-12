const dotenv = require("dotenv");
dotenv.config();
import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import blogModel from "../../models/blog";
import { mapFiles } from "../../middlewares/file";
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
export const createBlog = async (req: Request, res: Response) => {
  const { title, description, images } = req.body;

  try {
    const files = await mapFiles(images);
    const blog: any = new blogModel({
      title,
      description,
      images: files,
    });
    const data: any = await blog.save();
    console.log(data);
    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
    console.log(error);
  }
};

export const updateblog = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data: any = await blogModel.findByIdAndUpdate(
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

export const deleteblog = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data: any = await blogModel.findByIdAndDelete(id);
    res.json({ message: "blog successfully deleted" });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getblogs = async (req: Request, res: Response) => {
  const category = req.query.category;
  const name = req.query.name;
  const newP = req.query.new;
  console.log(req.query);
  try {
    let data: any;
    if (category) {
      data = await blogModel.find({
        categories: { $in: [category] },
      });
    } else if (newP) {
      data = await blogModel.find().sort({ createdAt: -1 }).limit(10);
    } else if (name) {
      data = await blogModel.find({ name });
    } else {
      data = await blogModel.find();
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
    const data: any = await blogModel.findById(id);
    if (data._id != id) return res.json({ error: "blog not found" });
    console.log(data);
    res.json({ data });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};
