import { Client } from "pg";

export interface IDbInit {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

export default class DataBase {
  private client: any;
  constructor(dbInit: IDbInit) {
    console.log("[DataBase - constructor]: dbInit -> ", dbInit);
    this.client = new Client(dbInit);
  }
  public connect = async () => {
    try {
      await this.client.connect();
      console.log("[DataBase]: connected");
    } catch (err) {
      console.error("[DataBase]: Connection error", err.stack);
    }
  };

  public query = async (query: any) => {
    try {
      return await this.client.query(query);
    } catch (err) {
      console.log(err.stack);
    }
  };
}
