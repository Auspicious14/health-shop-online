const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import * as argon2 from "argon2";
import userAuthModel from "../../models/userAuth";
import { handleErrors } from "../../middlewares/errorHandler";
dotenv.config();
const secret = process.env.TOKEN_SECRET;
const expiresIn = 60 * 60;

export const createUserAuth = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const hashedPassword = await argon2.hash(password);
    const user: any = await userAuthModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    res.json({
      user: {
        _id: user?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        isAdmin: user?.isAdmin,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
      },
    });
  } catch (error) {
    const err = handleErrors(error);
    res.json({ err });
  }
};

export const loginUserAuth = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user: any = await userAuthModel.findOne({ email });
    if (!user.email) return res.json({ error: "Account Not found" });
    const comparePassword: boolean = await argon2.verify(
      user.password,
      password
    );
    if (!comparePassword) return res.json({ error: "Wrong password" });
    res.json({
      user: {
        _id: user?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        isAdmin: user?.isAdmin,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
      },
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const updateuser = async (req: Request, res: Response) => {
  const id = req.params.id;
  let { firstName, lastName, email, password, isAdmin } = req.body;
  try {
    if (password) {
      password = await argon2.hash(password);
    }
    const user: any = await userAuthModel.findByIdAndUpdate(
      id,
      {
        $set: { firstName, lastName, email, password, isAdmin },
      },
      { new: true }
    );
    if (!user) return res.json({ error: "No user matched" });

    res.json({
      user: {
        _id: user?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        isAdmin: user?.isAdmin,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
      },
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const deleteUserAuth = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user: any = await userAuthModel.findByIdAndDelete(id);
    res.json({ message: "user has been deleted" });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getUserAuth = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user: any = await userAuthModel.findById(id).select("-password");
    res.json({ user });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};

export const getUsersAuth = async (req: Request, res: Response) => {
  const query = req.query.new;
  try {
    const users: any = query
      ? await userAuthModel
          .find()
          .select("-password")
          .sort({ _id: -1 })
          .limit(10)
      : await userAuthModel.find().select("-password");
    res.json({ users });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};
