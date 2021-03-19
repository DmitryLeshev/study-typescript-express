import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { ClientResponse } from "..";
import { Roles } from "../../types/roles.types";
import { Methods } from "../Controller/types";

export default class Middlewares extends ClientResponse {
  public authCheck = (
    req: Request & { user: any },
    res: Response,
    next: NextFunction
  ) => {
    if (req.method === Methods.OPTIONS) return next();
    try {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return this.forbidden(res, "Пользователь не авторизован");
      }

      const decodedData = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decodedData;
      next();
    } catch (e) {
      return this.serverError(res, "Error in the catch block authCheck", e);
    }
  };

  public rolesAvailable = (roles: Roles[]) => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.method === Methods.OPTIONS) return next();
    try {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return this.forbidden(res, "Пользователь не авторизован");
      }

      const { roles: userRoles }: any = jwt.verify(
        token,
        process.env.SECRET_KEY
      );

      let hasRole: boolean = false;

      userRoles.forEach((el: Roles) => {
        if (roles.includes(el)) {
          hasRole = true;
        }
      });

      if (!hasRole) {
        return this.forbidden(res, "У вас нет доступа");
      }

      next();
    } catch (e) {
      return this.serverError(res, "Error in the catch block authCheck", e);
    }
  };
}
