import { NextFunction, Request, Response, Router } from "express";
import { Controller } from "../../../classes";
import { Methods, IRoute } from "../../../classes/Controller/Controller";

export default class UsersController extends Controller {
  public path = "/users";
  public router: Router = Router();
  public routes: IRoute[];

  constructor() {
    super();

    this.routes = [
      {
        path: "/",
        method: Methods.GET,
        handler: this.getUsers,
        localMiddleware: [],
      },
      {
        path: "/:id",
        method: Methods.GET,
        handler: this.getUser,
        localMiddleware: [],
      },
      {
        path: "/",
        method: Methods.POST,
        handler: this.createUser,
        localMiddleware: [],
      },
      {
        path: "/:id",
        method: Methods.DELETE,
        handler: this.deleteUser,
        localMiddleware: [],
      },
      {
        path: "/:id",
        method: Methods.PUT,
        handler: this.updateUser,
        localMiddleware: [],
      },
    ];

    this.setRoutes();
  }

  getUsers = (req: Request, res: Response, next: NextFunction): any => {
    this.ok<string[]>(res);
  };

  getUser = (req: Request, res: Response, next: NextFunction): any => {
    this.ok<string[]>(res);
  };

  createUser = (req: Request, res: Response, next: NextFunction): any => {
    this.ok<string[]>(res);
  };

  deleteUser = (req: Request, res: Response, next: NextFunction): any => {
    this.ok<string[]>(res);
  };

  updateUser = (req: Request, res: Response, next: NextFunction): any => {
    this.ok<string[]>(res);
  };
}
