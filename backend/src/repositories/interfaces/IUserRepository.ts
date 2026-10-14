import type { User } from "../../models/user.models.js";

export interface UserInput {
  name: string;
  email: string;
  password: string;
  roleId: number;
}

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  list(): Promise<User[]>;
  create(input: UserInput): Promise<User>;
  updateRole(user: User, roleId: number): Promise<User>;
}
