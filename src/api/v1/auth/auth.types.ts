export interface IUser {
  id: number;
  email: string;
  password: string;
  role: number;
}

export interface RegistrationDTO {
  email: string;
  password: string;
  role?: number;
}
