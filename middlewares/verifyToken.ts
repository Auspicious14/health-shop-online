import { NextFunction, Request, response, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userAuthModel from "../models/userAuth";
import { handleErrors } from "./errorHandler";
dotenv.config();
const secret: any = process.env.TOKEN_SECRET;
export const verifyToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token: any = req.cookies.jwt;
  if (!token) return res.json({ error: "Not authorized" });
  const verifyToken = jwt.verify(token, secret, (err: any, user: any) => {
    if (err) return res.json({ error: "invalid token" });
    req.user = user;
    next();
  });
  return verifyToken;
};

export const verifyTokenAndAuth = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const user = await userAuthModel.findById({ _id: id });
    if (!user) return new Error("no user found");
    console.log(user);
    if (user?._id == id) {
      next();
    } else {
      res.json({ error: "unauthorised user" });
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};
export const verifyTokenAndAdmin = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const user = await userAuthModel.findById({ _id: id });
    if (!user) return new Error("no user found");
    console.log(user);
    if (user?.isAdmin) {
      next();
    } else {
      res.json({ error: "unauthorised user" });
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};
