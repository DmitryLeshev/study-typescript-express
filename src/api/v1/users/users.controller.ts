import { NextFunction, Request, Response, Router } from "express";
import { check, validationResult } from "express-validator";
import { Controller, Middlewares } from "../../../classes";
import { Methods, IRoute } from "../../../classes/Controller/types";
import { Roles } from "../../../types/roles.types";
import {
  CreateDTO,
  GetDTO,
  IUser,
  LoginDTO,
  RegistrationDTO,
} from "./user.types";
import UsersService from "./users.service";

export default class UsersController extends Controller {
  public path = "/users";
  public router: Router = Router();
  public routes: IRoute[];

  private service = new UsersService();
  private middlewares = new Middlewares();

  constructor() {
    super();

    this.routes = [
      {
        path: "/registration",
        method: Methods.POST,
        handler: this.registration,
        localMiddleware: [
          check("email", "Email должен быть Email'ом").isEmail().notEmpty(),
          check(
            "password",
            "Пароль должен меньше бла-бла-бла (6) и не больше бла-бла-бла (12)"
          ).isLength({
            min: 6,
            max: 12,
          }),
        ],
      },
      {
        path: "/login",
        method: Methods.POST,
        handler: this.login,
        localMiddleware: [],
      },
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
        localMiddleware: [
          this.middlewares.authCheck,
          this.middlewares.rolesAvailable([Roles.USER]),
        ],
      },
      {
        path: "/",
        method: Methods.POST,
        handler: this.createUser,
        localMiddleware: [
          this.middlewares.authCheck,
          this.middlewares.rolesAvailable([Roles.USER]),
        ],
      },
      {
        path: "/:id",
        method: Methods.DELETE,
        handler: this.deleteUser,
        localMiddleware: [
          this.middlewares.authCheck,
          this.middlewares.rolesAvailable([Roles.USER, Roles.ADMIN]),
        ],
      },
      {
        path: "/:id",
        method: Methods.PUT,
        handler: this.updateUser,
        localMiddleware: [
          this.middlewares.authCheck,
          this.middlewares.rolesAvailable([Roles.USER]),
        ],
      },
    ];

    this.setRoutes();
  }

  getUsers = async (_req: Request, res: Response, next: NextFunction) => {
    const resDTO = await this.service.getUsers();
    if (resDTO.status !== "success") {
      return resDTO.fn(res, resDTO.message);
    }
    const { message, data } = resDTO;
    return this.ok<IUser[]>(res, message, data);
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const getUserDTO: GetDTO = {
      id: Number(id),
    };

    const resDTO = await this.service.getUser(getUserDTO);

    if (resDTO.status !== "success") {
      return resDTO.fn(res, resDTO.message);
    }

    const { message, data } = resDTO;
    this.ok<IUser>(res, message, data);
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const getUserDTO: GetDTO = {
      id: Number(id),
    };

    const resDTO = await this.service.getUser(getUserDTO);

    if (resDTO.status !== "success") {
      return resDTO.fn(res, resDTO.message);
    }

    const { message, data } = resDTO;
    this.ok<IUser>(res, message, data);
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const getUserDTO: GetDTO = {
      id: Number(id),
    };

    const resDTO = await this.service.getUser(getUserDTO);

    if (resDTO.status !== "success") {
      return resDTO.fn(res, resDTO.message);
    }

    const { message, data } = resDTO;
    this.ok<IUser>(res, message, data);
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const getUserDTO: GetDTO = {
      id: Number(id),
    };

    const resDTO = await this.service.getUser(getUserDTO);

    if (resDTO.status !== "success") {
      return resDTO.fn(res, resDTO.message);
    }

    const { message, data } = resDTO;
    this.ok<IUser>(res, message, data);
  };

  registration = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return this.validatorErrors(res, errors);
      }

      const { email, password, roles } = req.body;
      const createDRO: CreateDTO = {
        email,
        password,
        roles,
      };

      const resDTO = await this.service.createUser(createDRO);

      if (resDTO.status !== "success") {
        return resDTO.fn(res, resDTO.message);
      }

      const { message, data } = resDTO;
      return this.created<IUser>(res, message, data);
    } catch (e) {
      return this.serverError(res, "Error in the catch block Registration", e);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const loginDTO: LoginDTO = {
      email,
      password,
    };
    const resDTO = await this.service.login(loginDTO);
    if (resDTO.status !== "success") {
      return resDTO.fn(res, resDTO.message);
    }
    const { message, data } = resDTO;
    return this.ok<{ user: IUser; token: any }>(res, message, data);
  };
}
