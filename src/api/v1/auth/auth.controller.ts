import { NextFunction, Request, Response, Router } from "express";
import { Controller } from "../../../classes";
import { Methods, IRoute } from "../../../classes/Controller/Controller";
import { db } from "../../../main";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";

export default class AuthController extends Controller {
  public path = "/auth";
  public router: Router = Router();
  public routes: IRoute[];

  constructor() {
    super();

    this.routes = [
      {
        path: "/registration",
        method: Methods.POST,
        handler: this.registration,
        localMiddleware: [
          check("email", "Email должен быть").isEmail().notEmpty(),
          check("password", "Пароль должен быть бла-бла-бла").isLength({
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
        path: "/users",
        method: Methods.GET,
        handler: this.getUsers,
        localMiddleware: [],
      },
    ];

    this.setRoutes();
  }

  getUsers = (req: Request, res: Response, next: NextFunction) => {
    this.ok<string[]>(res);
  };

  registration = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const error = validationResult(req);
      console.log(error);
      if (!error.isEmpty()) {
        return res
          .status(400)
          .json({ status: "fail", message: "Express validator", error });
      }
      const { email, password, role } = req.body;
      console.log(email, password);
      let query = `SELECT * FROM users WHERE email = '${email}'`;
      const candidate = await (await db.query(query)).rows[0];
      if (candidate) {
        return res
          .status(400)
          .json({ status: "fail", message: "Такой емайл уже занят" });
      }
      const hashPassword = bcrypt.hashSync(password, 5);
      query = `INSERT INTO users (email, password) VALUES ('${email}', '${hashPassword}') RETURNING *`;
      const user = await (await db.query(query)).rows[0];
      if (!user) {
        return res.status(400).json({
          status: "fail",
          message: "Не получилось создать пользователя",
        });
      }
      query = `INSERT INTO users_roles (user_id, role_id) VALUES('${
        user.id
      }', ${role || 1}) RETURNING *`;
      const userRole = await (await db.query(query)).rows[0];
      if (!userRole) {
        return res
          .status(400)
          .json({ status: "fail", message: "Не получилось создать роль" });
      }
      user.role = userRole.role;
      return this.ok<string[]>(res, "С пылу жару", user);
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Block catch registration" });
    }
  };

  login = (req: Request, res: Response, next: NextFunction) => {
    this.ok<string[]>(res);
  };
}
