import type { Role } from "../../models/roles.models.js";

export interface IRoleRepository {
  findAll(): Promise<Role[]>;
  findById(id: number): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  permissionNames(roleId: number): Promise<string[]>;
}
