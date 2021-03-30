import { Roles } from "../../../types/roles.types";

export interface IUser {
  id: number;
  email: string;
  password: string;
  roles: Roles[];
}

export interface GetDTO {
  id?: number;
  search?: string;
}

export interface CreateDTO {
  email: string;
  password: string;
  roles?: number[];
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface DeleteDTO {
  id?: number;
}

export interface UpdateDTO {
  id?: number;
  email?: string;
}

export interface RegistrationDTO {
  email: string;
  password: string;
  roles?: number[];
}
