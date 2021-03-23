import { NextFunction, Request, Response, Router } from "express";

import UsersController from "./users";

import { Controller } from "../../classes";
import { IRoute, Methods } from "../../classes/Controller/types";

class IndexController extends Controller {
  public path = "/";
  public router = Router();
  public routes: IRoute[];

  constructor() {
    super();
    this.routes = [
      {
        path: "/",
        method: Methods.GET,
        handler: this.handleIndex,
        localMiddleware: [],
      },
    ];

    this.setRoutes();
  }

  async handleIndex(_req: Request, res: Response, _next: NextFunction) {
    this.ok(res);
  }
}

export { IndexController, UsersController };
