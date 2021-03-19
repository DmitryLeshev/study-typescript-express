import Service from "../../../classes/Service";
import { db } from "../../../main";
import { IUser, RegistrationDTO } from "./auth.types";
import bcrypt from "bcryptjs";

class UserSchema {
  private tableName = "users";
  private defaultRole = 1;

  public getOne = async (obj: any) => {
    const { where } = obj;
    const key = Object.keys(where)[0];
    const query = `SELECT * FROM ${this.tableName} WHERE ${key} = '${where[key]}'`;
    const user = await (await db.query(query)).rows[0];
    return user;
  };

  public create = async (createDTO) => {
    const { email, password, role } = createDTO;
    let query = `INSERT INTO users (email, password) VALUES ('${email}', '${password}') RETURNING *`;
    const user = await (await db.query(query)).rows[0];
    query = `INSERT INTO users_roles (user_id, role_id) VALUES('${user.id}', ${
      role || this.defaultRole
    }) RETURNING *`;
    const userRoleID = await (await db.query(query)).rows[0];
    query = `SELECT role FROM roles WHERE id = '${userRoleID.role_id}'`;
    const userRole = await (await db.query(query)).rows[0];
    user.role = userRole.role;
    user.roleId = userRoleID.role_id;
    return user;
  };
}

export default class AuthService extends Service {
  registration = async (dto: RegistrationDTO): Promise<any> => {
    const User = new UserSchema();
    const { email, password, role } = dto;
    const candidate: IUser = await User.getOne({ where: { email } });
    console.log("registartion", candidate);
    if (candidate) {
      return {
        status: "fail",
        fn: this.badRequest,
        message: "Такой email занят",
      };
    }
    const hashPassword = bcrypt.hashSync(password, 5);
    const user: IUser = await User.create({
      email,
      password: hashPassword,
      role,
    });
    return {
      status: "success",
      message: "Вы успешно зарегистрировались (Красава братишка!)",
      data: user,
    };
  };
}
