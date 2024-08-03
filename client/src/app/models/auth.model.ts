import { Metadata } from './metadata';

interface Info {
  name?: string;
  email: string;
}

export interface Credentials extends Info {
  password: string;
  confirmPassword?: string;
}

export interface User extends Info, Metadata {
  name: string;
}

export interface UserData {
  user: User;
  token: string;
  expiresIn: number;
  exp: number;
  iat: number;
}
