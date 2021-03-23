import { Roles } from "../../../types/roles.types";

export interface IUser {
  id: number;
  email: string;
  password: string;
  roles: Roles[];
}

export interface RegistrationDTO {
  email: string;
  password: string;
  role?: number;
}

export interface LoginDTO {
  email: string;
  password: string;
}
