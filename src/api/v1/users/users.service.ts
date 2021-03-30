import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Service from "../../../classes/Service";
import {
  CreateDTO,
  DeleteDTO,
  GetDTO,
  IUser,
  LoginDTO,
  UpdateDTO,
} from "./user.types";
import UserModel from "./user.model";
import {
  HttpStatusVariant,
  ResDTO,
} from "../../../classes/ClientResponse/types";

const generateAccessToken = (id: number, roles: string[]) => {
  const payload = { id, roles };
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
};

export default class UsersService extends Service {
  shema = new UserModel();

  getUsers = async (): Promise<ResDTO<IUser[]>> => {
    const users: IUser[] = await this.shema.getAll();
    if (!users) {
      return {
        status: HttpStatusVariant.FAIL,
        fn: this.notFound,
        message: "Пользователи не найдены =(",
      };
    }
    return {
      status: HttpStatusVariant.SUCCESS,
      message: "Ваш список пользователей ;)",
      data: users,
    };
  };

  getUser = async (dto: GetDTO): Promise<ResDTO<IUser>> => {
    const { id } = dto;
    const user: IUser = await this.shema.getOne({ id });
    if (!user) {
      return {
        status: HttpStatusVariant.FAIL,
        fn: this.notFound,
        message: `Пользователь по id ${id} не найден =(`,
      };
    }
    return {
      status: HttpStatusVariant.SUCCESS,
      message: "Вы успешно зарегистрировались (Красава братишка!)",
      data: user,
    };
  };

  deleteUser = async (dto: DeleteDTO): Promise<ResDTO<IUser>> => {
    const { id } = dto;
    const user: IUser = await this.shema.delete({ id });
    if (!user) {
      return {
        status: HttpStatusVariant.FAIL,
        fn: this.notFound,
        message: `Пользователь по id ${id} не найден =(`,
      };
    }
    return {
      status: HttpStatusVariant.SUCCESS,
      message: `Пользователь под номером №${id}, уничтожен`,
      data: user,
    };
  };

  updateUser = async (dto: UpdateDTO): Promise<ResDTO<IUser>> => {
    const { email, id } = dto;
    const user: IUser = await this.shema.update({ id, email });
    if (!user) {
      return {
        status: HttpStatusVariant.FAIL,
        fn: this.notFound,
        message: `Пользователь по id ${id} не найден =(`,
      };
    }
    return {
      status: HttpStatusVariant.SUCCESS,
      message: `Пользователь c ${id}, изменён`,
      data: user,
    };
  };

  createUser = async (dto: CreateDTO): Promise<ResDTO<IUser>> => {
    const { email, password, roles } = dto;
    const candidate: IUser = await this.shema.getOne({ email });
    if (candidate) {
      return {
        status: HttpStatusVariant.FAIL,
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
      status: HttpStatusVariant.SUCCESS,
      message: "Вы успешно зарегистрировались (Красава братишка!)",
      data: user,
    };
  };

  login = async (
    dto: LoginDTO
  ): Promise<ResDTO<{ user: IUser; token: any }>> => {
    const { email, password } = dto;
    const user: IUser = await this.shema.getOne({ email });

    if (!user) {
      return {
        status: HttpStatusVariant.FAIL,
        fn: this.badRequest,
        message: "Такого пользователя в базе нэтъ",
      };
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return {
        status: HttpStatusVariant.FAIL,
        fn: this.badRequest,
        message:
          "Не верный пароль, знаю-знаю это подсказка для злоумышленников",
      };
    }

    const token = generateAccessToken(user.id, user.roles);

    return {
      status: HttpStatusVariant.SUCCESS,
      message:
        "ХОРОШ! ХОРОШ, ХОРОШ! Бро, мои поздравления, держи заслуженный токен",
      data: { user, token },
    };
  };
}
