import express from "express";
import {
  deleteFavorite,
  getFavorites,
  getOneFavorite,
  saveToFavorite,
} from "../controllers/favorite/favorite";
import { helper } from "./helper";

export class favoriteRouter {
  router: express.Router;
  private helperSvc: helper;

  constructor() {
    this.helperSvc = new helper();
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put("/favorite/save", saveToFavorite);
    this.router.get("/favorites", this.helperSvc.routeHandler(getFavorites));
    this.router.get(
      "/favorite/:_id",
      this.helperSvc.routeHandler(getOneFavorite)
    );
    this.router.delete(
      "/favorite/:_id",
      this.helperSvc.routeHandler(deleteFavorite)
    );
  }
}
