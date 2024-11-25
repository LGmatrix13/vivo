import { Role } from "./role";

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}
