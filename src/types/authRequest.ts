import { Request } from "express";

interface UserData {
  id: string;
  email: string;
  role: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthRequest extends Request {
  user?: UserData;
}
