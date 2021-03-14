import { NextFunction, Request, Response, Router } from "express";
import { Methods } from "../../classes/Controller/Controller"; // Вынести в типы

import UsersController from "./users";
import AuthController from "./auth";

class IndexController {
  public path = "/";
  public router = Router();

  constructor() {
    this.initRouter();
  }

  initRouter() {
    this.router.get(this.path, this.handleIndex);
  }

  routes = [
    {
      path: "/",
      method: Methods.GET,
      handler: this.handleIndex,
      localMiddleware: [],
    },
  ];

  async handleIndex(_req: Request, res: Response, _next: NextFunction) {
    res.status(200).json({
      code: 200,
      status: "success",
      message: "У тебя получилось сделать запросик",
      data: {
        id: 1,
        name: "Красавчик",
      },
    });
  }
}

export { IndexController, UsersController, AuthController };
