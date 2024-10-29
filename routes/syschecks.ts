import express, { Request, Response } from "express";

const router = express.Router();

router.get("/health", (req: Request, res: Response) => {
  res.status(200).json("Healthy");
});

router.get("/ready", (req: Request, res: Response) => {
  res.status(200).json("Redy");
});

export default router;
