import bcrypt from "bcrypt";
import type { Sequelize, Transaction } from "sequelize";
import { Books } from "../models/book.models.js";
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

const sampleBooks = [
    {
        title: "El Principito",
        description: "Un pequeño príncipe viaja por el universo y descubre el valor de la amistad y la responsabilidad.",
    },
    {
        title: "Clean Code",
        description: "Una guía práctica para escribir software claro, legible y fácil de mantener.",
    },
    {
        title: "Fundación",
        description: "Una historia de ciencia ficción sobre la caída de un imperio y el futuro de una civilización.",
    },
    {
        title: "1984",
        description: "Una novela distópica sobre la vigilancia, la censura y el control de la información.",
    },
    {
        title: "El Aleph",
        description: "Relatos de Jorge Luis Borges que exploran laberintos, memoria y otros enigmas.",
    },
] as const;

export async function seedBooks(): Promise<void> {
    for (const book of sampleBooks) {
        await Books.findOrCreate({
            where: { title: book.title },
            defaults: book,
        });
    }
}

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
