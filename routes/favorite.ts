import express from "express";
import {
  addToFavorite,
  getFavorites,
  getOneFavorite,
  updateFavorite,
} from "../controllers/favorite/favorite";
import { helper } from "./helper";

export class favoriteRouter {
  private router: express.Router;

  constructor(private helperSvc: helper) {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/favorite/add",
      this.helperSvc.routeHandler(addToFavorite)
    );
    this.router.put(
      "/favorite/update",
      this.helperSvc.routeHandler(updateFavorite)
    );
    this.router.get("/favorites", this.helperSvc.routeHandler(getFavorites));
    this.router.get(
      "/favorite/:_id",
      this.helperSvc.routeHandler(getOneFavorite)
    );
  }
}
