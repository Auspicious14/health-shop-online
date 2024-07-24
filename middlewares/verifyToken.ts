import { NextFunction, Request, response, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userAuthModel from "../models/userAuth";
import { handleErrors } from "./errorHandler";
dotenv.config();
// const secret: any = process.env.TOKEN_SECRET;
const JWT_SECRET: any = process.env.JWT_SECRET;

export const verifyToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token: any = req.cookies.token;
  if (!token) return res.json({ error: "Not authorized" });
  const verifyToken = jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
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
  const { userId } = req.params;
  const id = userId;
  try {
    const user = await userAuthModel.findById({ _id: id });
    if (!user) return new Error("no user found");
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
  const token = req.cookies.token;
  console.log(token, "token");
  if (!token) return res.status(401).json({ error: "User not authenticated" });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await userAuthModel.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.isAdmin) {
      req.user = user;
      next();
    } else {
      res.status(403).json({ error: "Unauthorized user" });
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ errors });
  }
};
