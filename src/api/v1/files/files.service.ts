import Service from "../../../classes/Service";

import FileModel from "./file.model";

import { IFile } from "./files.types";

import {
  HttpStatusVariant,
  ResDTO,
} from "../../../classes/ClientResponse/types";

export default class FilesService extends Service {
  shema = new FileModel();

  getAll = async (): Promise<ResDTO<IFile[]>> => {
    const file: IFile = await this.shema.getOne("getAll");

    return {
      status: HttpStatusVariant.SUCCESS,
      message: "Опачки, вот и файл ;)",
      data: [file],
    };
  };

  getOne = async (dto: { fileName: string }): Promise<ResDTO<IFile>> => {
    const { fileName } = dto;

    const file: IFile = await this.shema.getOne(fileName);

    return {
      status: HttpStatusVariant.SUCCESS,
      message: "Опачки, вот и файл ;)",
      data: file,
    };
  };

  addOne = async (dto: { fileName: string }): Promise<ResDTO<IFile>> => {
    const { fileName } = dto;

    const file: IFile = await this.shema.getOne(fileName);

    return {
      status: HttpStatusVariant.SUCCESS,
      message: "Опачки, вот и файл ;)",
      data: file,
    };
  };
}
