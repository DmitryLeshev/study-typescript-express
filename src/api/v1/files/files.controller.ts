import { NextFunction, Request, Response, Router } from "express";
import { check, validationResult } from "express-validator";

import { Controller, Middlewares } from "../../../classes";
import { Methods, IRoute } from "../../../classes/Controller/types";

import { IFile } from "./files.types";
import FilesService from "./files.service";

import { Roles } from "../../../types/roles.types";

export default class UsersController extends Controller {
  public path = "/files";
  public router: Router = Router();
  public routes: IRoute[];

  private service = new FilesService();
  private middlewares = new Middlewares();

  constructor() {
    super();

    this.routes = [
      {
        path: "/",
        method: Methods.GET,
        handler: this.getAll,
        localMiddleware: [],
      },
      {
        path: "/:id",
        method: Methods.GET,
        handler: this.getOne,
        localMiddleware: [],
      },
      {
        path: "/:id",
        method: Methods.POST,
        handler: this.addOne,
        localMiddleware: [],
      },
    ];

    this.setRoutes();
  }

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    const resDTO = await this.service.getAll();
    if (resDTO.status !== "success") {
      return resDTO.fn(res, resDTO.message);
    }
    const { message, data } = resDTO;
    return this.ok<IFile[]>(res, message, data);
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    const dto = {
      fileName: req.params.id,
    };
    const resDTO = await this.service.getOne(dto);
    if (resDTO.status !== "success") {
      return resDTO.fn(res, resDTO.message);
    }
    const { message, data } = resDTO;
    return this.ok<IFile>(res, message, data);
  };

  addOne = async (req: Request, res: Response, next: NextFunction) => {
    const dto = {
      fileName: req.params.id,
    };
    const resDTO = await this.service.addOne(dto);
    if (resDTO.status !== "success") {
      return resDTO.fn(res, resDTO.message);
    }
    const { message, data } = resDTO;
    return this.ok<IFile>(res, message, data);
  };
}
