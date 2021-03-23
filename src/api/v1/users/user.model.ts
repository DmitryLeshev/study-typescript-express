import { db } from "../../../main";
import { RegistrationDTO } from "./user.types";

export default class UserModel {
  private tableName = "users";
  private defaultRole = 1;

  public getOne = async (obj: any) => {
    const { where } = obj;

    const key = Object.keys(where)[0];

    let query = `SELECT * FROM ${this.tableName} WHERE ${key} = '${where[key]}'`;
    const user = await (await db.query(query)).rows[0];

    if (!user) return;

    query = `SELECT r.role FROM users_roles ur LEFT JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = ${user.id}`;
    const userRoles = await (await db.query(query)).rows;

    console.log(userRoles.map((el) => el.role));
    user.roles = userRoles.map((el) => el.role);
    return user;
  };

  getAll = async () => {
    let query = `SELECT * FROM users u LEFT JOIN users`;
    return await (await db.query(query)).rows;
  };

  public create = async (createDTO: RegistrationDTO) => {
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
