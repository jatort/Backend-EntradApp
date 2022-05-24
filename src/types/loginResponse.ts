import { User } from "../schemas/User";

export interface UserData {
  email: string;
  role: string;
}

export interface LoginResponse {
  token?: string;
  message: string;
}
