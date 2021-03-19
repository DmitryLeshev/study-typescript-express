import { NextFunction, Request, Response, Router } from "express";
import { Controller, Middlewares } from "../../../classes";
import { Methods, IRoute } from "../../../classes/Controller/types";
import { db } from "../../../main";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Roles } from "../../../types/roles.types";

// Вынести в ютилиты
const generateAccessToken = (id: number, roles: string[]) => {
  const payload = { id, roles };
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
};

export default class AuthController extends Controller {
  public path = "/auth";
  public router: Router = Router();
  public routes: IRoute[];

  private middlewares = new Middlewares();

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
        localMiddleware: [this.middlewares.rolesAvailable([Roles.USER])],
      },
    ];

    this.setRoutes();
  }

  getUsers = (req: Request, res: Response, next: NextFunction) => {
    this.ok<string[]>(res);
  };

  registration = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        return this.validatorErrors(res, errors);
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

  login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    let query = `SELECT * FROM users WHERE email = '${email}'`;
    const user = await (await db.query(query)).rows[0];
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "Такого пользователя в базе нэту" });
    }
    query = `SELECT r.role FROM users_roles ur LEFT JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = ${user.id}`;
    const userRoles = await (await db.query(query)).rows;
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        status: "fail",
        message:
          "Не верный пароль, знаю-знаю это подсказка для злоумышленников",
      });
    }
    const token = generateAccessToken(
      user.id,
      userRoles.map((el) => el.role)
    );
    this.ok(
      res,
      "Ну тип ты прошёл проверку, чутка позже оправлю тебе токен, что бы система понимала авторизован ли ты",
      token
    );
  };
}
