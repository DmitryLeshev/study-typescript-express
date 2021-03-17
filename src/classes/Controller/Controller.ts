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
      message: message || "OK",
      data,
    });
  }

  created<T>(res: Response, message?: string, data?: T): Response {
    return res.status(201).json({
      code: 201,
      status: "success",
      message: message || "Created",
      data,
    });
  }

  noContent<T>(res: Response, message?: string, data?: T): Response {
    return res.status(204).json({
      code: 204,
      status: "success",
      message: message || "No Content",
      data,
    });
  }

  found<T>(res: Response, message?: string, data?: T): Response {
    return res.status(302).json({
      code: 302,
      status: "success",
      message: message || "Found",
      data,
    });
  }

  notModified<T>(res: Response, message?: string, data?: T): Response {
    return res.status(304).json({
      code: 304,
      status: "success",
      message: message || "Not Modified",
      data,
    });
  }

  badRequest<T>(res: Response, message?: string, data?: T): Response {
    return res.status(400).json({
      code: 400,
      status: "fail",
      message: message || "Bad Request",
      data,
    });
  }

  unauthorized<T>(res: Response, message?: string, data?: T): Response {
    return res.status(401).json({
      code: 401,
      status: "fail",
      message: message || "Unauthorized",
      data,
    });
  }

  notFound<T>(res: Response, message?: string, data?: T): Response {
    return res.status(404).json({
      code: 404,
      status: "fail",
      message: message || "Not Found",
      data,
    });
  }

  serverError<T>(res: Response, message?: string, data?: T): Response {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: message || "Internal Server Error",
      data,
    });
  }

  jsonResponse<T>(
    res: Response,
    code: number,
    message?: string,
    data?: T
  ): Response {
    return res.status(code).json({
      code,
      status: code < 400 ? "success" : code < 500 ? "fail" : "error",
      message,
      data,
    });
  }
}
