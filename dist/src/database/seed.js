import { Permission } from "../models/permission.js";
import { RolePermission } from "../models/role.models.js";
import { Role } from "../models/roles.models.js";
const roles = [
    {
        name: "admin",
        permissions: [
            "book:read",
            "book:create",
            "book:update",
            "book:change-status",
            "book:delete",
            "subscription:create",
            "subscription:delete",
            "notification:read",
            "user:read",
            "user:assign-role",
        ],
    },
    {
        name: "operador",
        permissions: [
            "book:read",
            "book:create",
            "book:update",
            "book:change-status",
            "subscription:create",
            "subscription:delete",
            "notification:read",
        ],
    },
    {
        name: "usuario",
        permissions: [
            "book:read",
            "subscription:create",
            "subscription:delete",
            "notification:read",
        ],
    },
];
export async function seedRolesAndPermissions(sequelize) {
    await sequelize.transaction(async (transaction) => {
        const permissionNames = [...new Set(roles.flatMap((role) => role.permissions))];
        const permissionsByName = new Map();
        for (const name of permissionNames) {
            const [permission] = await Permission.findOrCreate({
                where: { name },
                defaults: { name },
                transaction,
            });
            permissionsByName.set(name, permission);
        }
        for (const roleDefinition of roles) {
            const [role] = await Role.findOrCreate({
                where: { name: roleDefinition.name },
                defaults: { name: roleDefinition.name },
                transaction,
            });
            await RolePermission.destroy({
                where: { roleId: role.id },
                transaction,
            });
            const rolePermissionRows = roleDefinition.permissions.map((name) => {
                const permission = permissionsByName.get(name);
                if (!permission) {
                    throw new Error(`Permission "${name}" was not created by the seed.`);
                }
                return { roleId: role.id, permissionId: permission.id };
            });
            await RolePermission.bulkCreate(rolePermissionRows, { transaction });
        }
    });
}
//# sourceMappingURL=seed.js.map