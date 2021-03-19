import Service from "../../../classes/Service";
import { db } from "../../../main";
import { IUser, RegistrationDTO } from "./auth.types";

class UserSchema {
  private tableName = "users";
  public getOne = async (obj: any) => {
    const { where } = obj;
    const key = Object.keys(where)[0];
    const query = `SELECT * FROM ${this.tableName} WHERE ${key} = '${where[key]}'`;
    const user = await (await db.query(query)).rows[0];
    return user;
  };
}

export default class AuthService extends Service {
  registration = async (dto: RegistrationDTO): Promise<any> => {
    const User = new UserSchema();
    const { email, password, role } = dto;
    const user: IUser = await User.getOne({ where: { email } });
    console.log("registartion", user);
    if (user) return this.badRequest;
    return user;
  };
}
