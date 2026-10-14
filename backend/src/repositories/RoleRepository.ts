import { Permission } from "../models/permission.js";
import { RolePermission } from "../models/role.models.js";
import { Role } from "../models/roles.models.js";
import type { IRoleRepository } from "./interfaces/IRoleRepository.js";

export class RoleRepository implements IRoleRepository {
  findByName(name: string): Promise<Role | null> {
    return Role.findOne({ where: { name } });
  }

  findById(id: number): Promise<Role | null> {
    return Role.findByPk(id);
  }

  async getPermissions(roleId: number): Promise<string[]> {
    const assignments = await RolePermission.findAll({
      where: { roleId },
      attributes: ["permissionId"],
    });
    if (assignments.length === 0) {
      return [];
    }

    const permissions = await Permission.findAll({
      where: { id: assignments.map(({ permissionId }) => permissionId) },
      attributes: ["name"],
    });
    return permissions.map(({ name }) => name);
  }
}
