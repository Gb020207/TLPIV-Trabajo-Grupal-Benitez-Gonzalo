import bcrypt from "bcrypt";
import type { Sequelize, Transaction } from "sequelize";
import { Permission } from "../models/permission.js";
import { RolePermission } from "../models/role.models.js";
import { Role } from "../models/roles.models.js";
import { User } from "../models/user.models.js";

export interface SeedUser {
    email: string;
    password: string;
}

export interface SeedUsers {
    admin: SeedUser;
    operator: SeedUser;
    user: SeedUser;
}

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
] as const;

export async function seedRolesAndPermissions(
    sequelize: Sequelize,
    seedUsers: SeedUsers,
): Promise<void> {
    await sequelize.transaction(async (transaction: Transaction) => {
        const permissionNames = [...new Set(roles.flatMap((role) => role.permissions))];
        const permissionsByName = new Map<string, Permission>();

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

        for (const [roleName, credentials] of [
            ["admin", seedUsers.admin],
            ["operador", seedUsers.operator],
            ["usuario", seedUsers.user],
        ] as const) {
            if (
                !credentials.email.trim() ||
                !credentials.password ||
                credentials.password.length < 8
            ) {
                throw new Error(`Seed credentials for role "${roleName}" are invalid.`);
            }

            const role = await Role.findOne({
                where: { name: roleName },
                transaction,
            });
            if (!role) {
                throw new Error(`Seed role "${roleName}" is missing.`);
            }

            const email = credentials.email.trim().toLowerCase();
            const password = await bcrypt.hash(credentials.password, 10);
            const [user, created] = await User.findOrCreate({
                where: { email },
                defaults: {
                    name: roleName,
                    email,
                    password,
                    roleId: role.id,
                },
                transaction,
            });
            if (!created && user.roleId !== role.id) {
                await user.update({ roleId: role.id }, { transaction });
            }
        }
    });
}
