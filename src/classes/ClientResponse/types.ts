import { Response } from "express";

export const enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  FOUND = 302,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export const enum HttpStatusMessage {
  OK = "OK",
  CREATED = "CREATED",
  NO_CONTENT = "NO CONTENT",
  FOUND = "FOUND",
  NOT_MODIFIED = "NOT MODIFIED",
  BAD_REQUEST = "BAD REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  NOT_FOUND = "NOT FOUND",
  INTERNAL_SERVER_ERROR = "INTERNAL SERVER ERROR",
}

export interface MyResponse<T> {
  (res: Response, code?: HttpStatusCode, message?: string, data?: T): Response;
}
