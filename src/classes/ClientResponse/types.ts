import { Response } from "express";

export const enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  FOUND = 302,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
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
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT FOUND",
  INTERNAL_SERVER_ERROR = "INTERNAL SERVER ERROR",
}

export const enum HttpStatusVariant {
  SUCCESS = "success",
  FAIL = "fail",
  ERROR = "error",
}

export interface MyResponse<T> {
  (res: Response, code?: HttpStatusCode, message?: string, data?: T): Response;
}

export interface ResDTO<T> {
  status: HttpStatusVariant;
  fn?: any;
  message?: string;
  data?: T;
}
