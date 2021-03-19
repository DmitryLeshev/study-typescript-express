import { Response } from "express";
import {
  HttpStatusCode,
  HttpStatusMessage,
  HttpStatusVariant,
  MyResponse,
} from "./types";

export default class ClientResponse {
  public test: MyResponse<any> = (res, code, message, data) => {
    return res.status(code).json({
      code: HttpStatusCode.OK,
      message,
      data,
    });
  };

  public ok<T>(res: Response, message?: string, data?: T): Response {
    return res.status(200).json({
      code: 200,
      status: "success",
      message: message || "OK",
      data,
    });
  }

  public created<T>(res: Response, message?: string, data?: T): Response {
    return res.status(201).json({
      code: 201,
      status: "success",
      message: message || "Created",
      data,
    });
  }

  public noContent<T>(res: Response, message?: string, data?: T): Response {
    return res.status(204).json({
      code: 204,
      status: "success",
      message: message || "No Content",
      data,
    });
  }

  public found<T>(res: Response, message?: string, data?: T): Response {
    return res.status(302).json({
      code: 302,
      status: "success",
      message: message || "Found",
      data,
    });
  }

  public notModified<T>(res: Response, message?: string, data?: T): Response {
    return res.status(304).json({
      code: 304,
      status: "success",
      message: message || "Not Modified",
      data,
    });
  }

  public badRequest<T>(res: Response, message?: string, data?: T): Response {
    return res.status(400).json({
      code: 400,
      status: "fail",
      message: message || "Bad Request",
      data,
    });
  }

  public unauthorized<T>(res: Response, message?: string, data?: T): Response {
    return res.status(401).json({
      code: 401,
      status: "fail",
      message: message || "Unauthorized",
      data,
    });
  }

  public forbidden<T>(res: Response, message?: string, data?: T): Response {
    return res.status(HttpStatusCode.FORBIDDEN).json({
      code: HttpStatusCode.FORBIDDEN,
      status: HttpStatusVariant.FAIL,
      message: message || HttpStatusMessage.FORBIDDEN,
      data,
    });
  }

  public notFound<T>(res: Response, message?: string, data?: T): Response {
    return res.status(404).json({
      code: 404,
      status: "fail",
      message: message || "Not Found",
      data,
    });
  }

  public serverError<T>(res: Response, message?: string, error?: T): Response {
    if (error) console.log(error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: message || "Internal Server Error",
      error,
    });
  }

  public jsonResponse<T>(
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

  public validatorErrors<T>(res: Response, errors?: T): Response {
    if (errors) console.log(errors);
    return res.status(400).json({
      code: 400,
      status: "fail",
      message: "Express validator",
      ...errors,
    });
  }
}
