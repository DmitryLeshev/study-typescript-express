// import { QueryResult } from "pg";
// import { db } from "../../../main";
import fs from "fs";

import { IFile } from "./files.types";

export default class FileModel {
  private tableName = "File";
  private baseUrl = `http://localhost:${process.env.PORT}/`;

  public getOne = async (fileName: string): Promise<IFile> => {
    // Добвыть файл
    // const file = fs.readFile()
    return {
      fileName,
      url: "http://localhost:4000/bla-bla-bla",
    };
  };
}
