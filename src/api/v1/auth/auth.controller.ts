import { NextFunction, Request, Response, Router } from "express";
import { Controller } from "../../../classes";
import { Methods, IRoute } from "../../../classes/Controller/Controller";
import { db } from "../../../main";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Вынести в ютилиты
const generateAccessToken = (id: number, roles: string[]) => {
  const payload = { id, roles };
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
};

// В мидлваре
const authMiddleware = (
  req: Request & { user: any },
  res: Response,
  next: NextFunction
) => {
  if (req.method === "OPTIONS") return next();
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(403).json({
        code: 403,
        status: "fail",
        message: "Пользователь не авторизован",
      });
    }
    console.log(token);
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decodedData;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Block catch authMiddleware",
    });
  }
};

const roleMiddleware = (roles) => (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(403).json({
        code: 403,
        status: "fail",
        message: "Пользователь не авторизован",
      });
    }
    const { roles: userRoles }: any = jwt.verify(token, process.env.SECRET_KEY);
    let hasRole: boolean = false;

    userRoles.forEach((el: string) => {
      if (roles.includes(el)) {
        hasRole = true;
      }
    });

    if (!hasRole) {
      return res.status(403).json({
        code: 403,
        status: "fail",
        message: "У вас нет доступа",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Block catch roleMiddleware",
    });
  }
};

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
        localMiddleware: [authMiddleware, roleMiddleware(["ADMIN"])],
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
