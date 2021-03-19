import { Response } from "express";
import { HttpStatusCode, HttpStatusMessage, MyResponse } from "./types";

export default class ClientResponse {
  test: MyResponse<any> = (res, code, message, data) => {
    return res.status(code).json({
      code: HttpStatusCode.OK,
      message,
      data,
    });
  };

  ok<T>(res: Response, message?: string, data?: T): Response {
    return res.status(200).json({
      code: 200,
      status: "success",
      message: message || "OK",
      data,
    });
  }

  created<T>(res: Response, message?: string, data?: T): Response {
    return res.status(201).json({
      code: 201,
      status: "success",
      message: message || "Created",
      data,
    });
  }

  noContent<T>(res: Response, message?: string, data?: T): Response {
    return res.status(204).json({
      code: 204,
      status: "success",
      message: message || "No Content",
      data,
    });
  }

  found<T>(res: Response, message?: string, data?: T): Response {
    return res.status(302).json({
      code: 302,
      status: "success",
      message: message || "Found",
      data,
    });
  }

  notModified<T>(res: Response, message?: string, data?: T): Response {
    return res.status(304).json({
      code: 304,
      status: "success",
      message: message || "Not Modified",
      data,
    });
  }

  badRequest<T>(res: Response, message?: string, data?: T): Response {
    return res.status(400).json({
      code: 400,
      status: "fail",
      message: message || "Bad Request",
      data,
    });
  }

  unauthorized<T>(res: Response, message?: string, data?: T): Response {
    return res.status(401).json({
      code: 401,
      status: "fail",
      message: message || "Unauthorized",
      data,
    });
  }

  notFound<T>(res: Response, message?: string, data?: T): Response {
    return res.status(404).json({
      code: 404,
      status: "fail",
      message: message || "Not Found",
      data,
    });
  }

  serverError<T>(res: Response, message?: string, data?: T): Response {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: message || "Internal Server Error",
      data,
    });
  }

  jsonResponse<T>(
    res: Response,
    code: number,
    message?: string,
    data?: T
  ): Response {
    return res.status(code).json({
      code,
      status: code < 400 ? "success" : code < 500 ? "fail" : "error",
      message,
      data,
    });
  }
}
