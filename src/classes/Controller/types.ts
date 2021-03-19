import { NextFunction, Request, Response } from "express";

export enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  OPTIONS = "OPTIONS",
}

export interface IRoute {
  path: string;
  method: Methods;
  handler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void> | Response | any; // Проблема с express validatorom
  localMiddleware: Array<
    (req: Request, res: Response, next: NextFunction) => void
  >;
}
