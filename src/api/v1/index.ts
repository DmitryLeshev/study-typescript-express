import { NextFunction, Request, Response, Router } from "express";

import UsersController from "./users";
import FilesController from "./files";

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
      {
        path: "/",
        method: Methods.POST,
        handler: this.handlePost,
        localMiddleware: [],
      },
    ];

    this.setRoutes();
  }

  async handleIndex(_req: Request, res: Response, _next: NextFunction) {
    this.ok(res, "Handle Index");
  }

  async handlePost(req: Request, res: Response, _next: NextFunction) {
    const body = req.body;
    console.log(body);
    this.ok(res, "Handle Post", body);
  }
}

export default [IndexController, UsersController, FilesController];
