import App from "../App";
import Database from "../Database";

export interface IServerInit {
  app: App;
  db: Database;
  port: number;
}

export default class Server {
  private app: App;
  private db: Database;
  private port: number;
  constructor(serverInit: IServerInit) {
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
