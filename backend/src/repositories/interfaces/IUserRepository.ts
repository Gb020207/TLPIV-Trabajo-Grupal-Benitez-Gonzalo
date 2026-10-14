import type { User } from "../../models/user.models.js";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  roleId: number;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  listAllWithRoles(): Promise<User[]>;
  updateRole(userId: number, roleId: number): Promise<User | null>;
}
