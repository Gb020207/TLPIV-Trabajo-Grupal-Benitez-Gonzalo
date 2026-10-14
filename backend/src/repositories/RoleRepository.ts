import { Permission } from "../models/permission.js";
import { RolePermission } from "../models/role.models.js";
import { Role } from "../models/roles.models.js";
import type { IRoleRepository } from "./interfaces/IRoleRepository.js";

export class RoleRepository implements IRoleRepository {
  findById(id: number): Promise<Role | null> {
    return Role.findByPk(id);
  }

  findByName(name: string): Promise<Role | null> {
    return Role.findOne({ where: { name } });
  }

  async permissionNames(roleId: number): Promise<string[]> {
    const rolePermissions = await RolePermission.findAll({
      where: { roleId },
      attributes: ["permissionId"],
    });
    const permissions = await Permission.findAll({
      where: { id: rolePermissions.map(({ permissionId }) => permissionId) },
      attributes: ["name"],
    });
    return permissions.map(({ name }) => name);
  }
}
