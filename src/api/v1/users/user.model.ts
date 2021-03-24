import { db } from "../../../main";
import { IUser, RegistrationDTO } from "./user.types";

interface IWhere {
  email?: string;
  id?: number;
}

export default class UserModel {
  private tableName = "users";
  private defaultRole = 1;

  public getOne = async (where: IWhere) => {
    const { email, id } = where;

    const key = Object.keys(where)[0];

    let query = `
    SELECT * FROM ${this.tableName}
    WHERE ${key} = '${where[key]}'
    `;
    const user = await (await db.query(query)).rows[0];

    if (!user) return;

    query = `
    SELECT r.role FROM users_roles ur
    LEFT JOIN roles r
    ON ur.role_id = r.id
    WHERE ur.user_id = ${user.id}
    `;
    const userRoles = await (await db.query(query)).rows;

    console.log(userRoles.map((el) => el.role));
    user.roles = userRoles.map((el) => el.role);
    return user;
  };

  getAll = async () => {
    let query = `
    SELECT u.id, u.email, string_agg(r.role::varchar(255), ' ') as roles
    FROM users u
    JOIN users_roles as ur
    ON u.id = ur.user_id
    JOIN roles r ON r.id = ur.role_id
    GROUP BY u.id;
    `;
    const users = await (await db.query(query)).rows;
    users.map((user) => {
      user.roles = user.roles.split(" ");
      return user;
    });
    return users;
  };

  public create = async (createDTO: RegistrationDTO) => {
    const { email, password, roles = [1] } = createDTO;

    let query = `
    INSERT INTO users
    (email, password)
    VALUES ('${email}', '${password}')
    RETURNING *
    `;
    const user = await (await db.query(query)).rows[0];

    const promises = roles.map(async (role) => {
      query = `
      INSERT INTO users_roles
      (user_id, role_id)
      VALUES('${user.id}', ${role})
      RETURNING *
      `;
      await db.query(query);
    });
    await Promise.all(promises);

    // query = `
    // SELECT role
    // FROM roles
    // WHERE id = '${userRoleID.role_id}'
    // `;
    // const userRole = await (await db.query(query)).rows[0];

    // user.role = userRole.role;
    // user.roleId = userRoleID.role_id;

    return user;
  };
}
