import { Permission } from "../models/permission.js";
import { RolePermission } from "../models/role.models.js";
import { Role } from "../models/roles.models.js";
export class RoleRepository {
    findByName(name) {
        return Role.findOne({ where: { name } });
    }
    findById(id) {
        return Role.findByPk(id);
    }
    async getPermissions(roleId) {
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
//# sourceMappingURL=RoleRepository.js.map