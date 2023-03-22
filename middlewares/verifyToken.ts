import { NextFunction, Request, response, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userAuthModel from "../models/userAuth";
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

export const verifyTokenAndAuth = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      res.json({ error: "invalid params" });
    }
  });
};
export const verifyTokenAndAdmin = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  verifyToken(req, res, async () => {
    const _id = req.user.id;
    console.log(req.user.id);
    const user = await userAuthModel.findById({ _id });
    console.log(user);
    if (user?._id == req.user.id || user?.isAdmin) {
      next();
    } else {
      res.json({ error: "invalid params" });
    }
  });
};
