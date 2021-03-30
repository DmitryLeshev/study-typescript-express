import express from "express";
import { Application } from "express";
import * as path from "path";

export interface IAppInit {
  apiVersion: string;
  controllers: any[];
  middlewares: any[];
}

export default class App {
  private app: Application;
  private apiVersion: string;

  constructor(appInit: IAppInit) {
    this.app = express();
    this.apiVersion = appInit.apiVersion;

    this.middlewares(appInit.middlewares);
    this.routes(appInit.controllers);
    this.assets();
  }

  private middlewares = (middlewares: any) => {
    middlewares.forEach((middleware: any) => {
      this.app.use(middleware);
    });
  };

  private routes = (controllers: any) => {
    controllers.forEach((controller: any) => {
      this.app.use(this.apiVersion, controller.router);
    });
  };

  private assets() {
    this.app.use(express.static(path.resolve(__dirname, "..", "..", "static")));
  }

  public listen = (port: number) => {
    this.app.listen(port, () => {
      console.log(`[App]: Example app listening at http://localhost:${port}`);
    });
  };

  public kill = () => {
    console.log(`[App]: Невероятная ошибка, нажми "Ctl" + "C"`);
  };
}
