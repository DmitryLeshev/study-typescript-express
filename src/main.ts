import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import morgan from "morgan";

import { Server, App, Database } from "./classes";

import {
  IndexController,
  UsersController,
  AuthController,
} from "./api/v1/index";

const app = new App({
  apiVersion: process.env.API_VERSION,
  controllers: [
    new IndexController(),
    new UsersController(),
    new AuthController(),
  ],
  middlewares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    fileUpload({}),
    morgan("dev"),
  ],
});

export const db = new Database({
  user: process.env.POSTGRES_DB_USER,
  host: process.env.POSTGRES_DB_HOST,
  database: process.env.POSTGRES_DB_NAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  port: Number(process.env.POSTGRES_DB_PORT),
});

const server = new Server({
  port: Number(process.env.PORT),
  app,
  db,
});

server.start();
