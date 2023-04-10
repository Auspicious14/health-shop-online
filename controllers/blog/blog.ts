import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import blogModel from "../../models/blog";

export const createBlog = async (req: Request, res: Response) => {
  try {
    const blog: any = new blogModel(req.body);
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
