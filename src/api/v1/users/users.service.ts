import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Service from "../../../classes/Service";
import { IUser, LoginDTO, RegistrationDTO } from "./user.types";
import UserModel from "./user.model";

const generateAccessToken = (id: number, roles: string[]) => {
  const payload = { id, roles };
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
};

export default class UsersService extends Service {
  shema = new UserModel();

  getAllUsers = async () => {
    const users: IUser = await this.shema.getAll();
    if (!users) {
      return {
        status: "fail",
        fn: this.notFound,
        message: "Пользователи не найдены =(",
      };
    }
    return {
      status: "success",
      message: "Вы успешно зарегистрировались (Красава братишка!)",
      data: users,
    };
  };

  registration = async (dto: RegistrationDTO): Promise<any> => {
    const { email, password, roles } = dto;
    const candidate: IUser = await this.shema.getOne({ email });
    if (candidate) {
      return {
        status: "fail",
        fn: this.badRequest,
        message: "Такой email занят",
      };
    }
    const hashPassword = bcrypt.hashSync(password, 5);
    const user: IUser = await this.shema.create({
      email,
      password: hashPassword,
      roles,
    });
    return {
      status: "success",
      message: "Вы успешно зарегистрировались (Красава братишка!)",
      data: user,
    };
  };

  login = async (dto: LoginDTO): Promise<any> => {
    const { email, password } = dto;
    const candidate: IUser = await this.shema.getOne({ email });

    if (!candidate) {
      return {
        status: "fail",
        fn: this.badRequest,
        message: "Такого пользователя в базе нэтъ",
      };
    }

    const validPassword = bcrypt.compareSync(password, candidate.password);
    if (!validPassword) {
      return {
        status: "fail",
        fn: this.badRequest,
        message:
          "Не верный пароль, знаю-знаю это подсказка для злоумышленников",
      };
    }

    const token = generateAccessToken(candidate.id, candidate.roles);

    return {
      status: "success",
      message:
        "ХОРОШ! ХОРОШ, ХОРОШ! Бро, мои поздравления, держи заслуженный токен",
      data: { candidate, token },
    };
  };
}
