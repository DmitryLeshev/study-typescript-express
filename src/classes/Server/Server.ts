import App from "../App";
import DataBase from "../DataBase";

export interface IServerInit {
  app: App;
  db: DataBase;
  port: number;
}

export default class Server {
  private app: App;
  private db: DataBase;
  private port: number;
  constructor(serverInit: IServerInit) {
    console.log("[ServerInit - constructor]: serverInit -> ", serverInit);
    this.app = serverInit.app;
    this.db = serverInit.db;
    this.port = serverInit.port;
  }

  start = async () => {
    try {
      await this.db.connect();
      this.app.listen(this.port);
    } catch (error) {
      console.error(error);
      this.app.kill();
    }
  };
}
