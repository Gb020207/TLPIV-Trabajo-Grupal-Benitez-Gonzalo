import type { Role } from "../../models/roles.models.js";

export interface IRoleRepository {
  findByName(name: string): Promise<Role | null>;
  findById(id: number): Promise<Role | null>;
  getPermissions(roleId: number): Promise<string[]>;
}
