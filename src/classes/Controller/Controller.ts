import { Router } from "express";
import { ClientResponse } from "../";
import { IRoute, Methods } from "./types";

export default abstract class Controller extends ClientResponse {
  public abstract path: string;
  public abstract router: Router = Router();
  public abstract routes: IRoute[];

  constructor() {
    super();
  }

  public setRoutes = () => {
    for (const route of this.routes) {
      for (const mw of route.localMiddleware) {
        this.router.use(this.path + route.path, mw);
      }
      switch (route.method) {
        case Methods.GET:
          this.router.get(this.path + route.path, route.handler);
          break;
        case Methods.POST:
          this.router.post(this.path + route.path, route.handler);
          break;
        case Methods.PUT:
          this.router.put(this.path + route.path, route.handler);
          break;
        case Methods.DELETE:
          this.router.delete(this.path + route.path, route.handler);
          break;
        default:
        // Throw exception
      }
    }
  };
}
