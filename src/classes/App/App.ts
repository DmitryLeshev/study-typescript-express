import express from "express";
import { Application } from "express";

export interface IAppInit {
  apiVersion: string;
  controllers: any[];
  middlewares: any[];
}

export default class App {
  private app: Application;
  private apiVersion: string;

  constructor(appInit: IAppInit) {
    console.log("[APP - constructor]: appInit -> ", appInit);
    this.app = express();
    this.apiVersion = appInit.apiVersion;

    this.middlewares(appInit.middlewares);
    this.routes(appInit.controllers);
    this.errorMiddleware();
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

  private errorMiddleware = () => {
    // this.app.use(errorMiddleware);
  };

  public listen = (port: number) => {
    this.app.listen(port, () => {
      console.log(`[App]: Example app listening at http://localhost:${port}`);
    });
  };

  public kill = () => {
    console.log(`[App]: Невероятная ошибка, нажми "Ctl" + "C"`);
  };
}
