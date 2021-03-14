import { NextFunction, Request, Response, Router } from "express";

export enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export interface IRoute {
  path: string;
  method: Methods;
  handler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void> | Response | any; // Проблема с express validatorom
  localMiddleware: ((
    req: Request,
    res: Response,
    next: NextFunction
  ) => void)[];
}

export default abstract class Controller {
  public abstract path: string;
  public abstract router: Router = Router();
  public abstract routes: IRoute[];

  constructor() {}

  public setRoutes = () => {
    for (const route of this.routes) {
      for (const mw of route.localMiddleware) {
        this.router.use(this.path + route.path, mw);
      }
      switch (route.method) {
        case "GET":
          this.router.get(this.path + route.path, route.handler);
          break;
        case "POST":
          this.router.post(this.path + route.path, route.handler);
          break;
        case "PUT":
          this.router.put(this.path + route.path, route.handler);
          break;
        case "DELETE":
          this.router.delete(this.path + route.path, route.handler);
          break;
        default:
        // Throw exception
      }
    }
  };

  ok<T>(res: Response, message?: string, data?: T): Response {
    return res.status(200).json({
      code: 200,
      status: "success",
      message,
      data,
    });
  }
}
