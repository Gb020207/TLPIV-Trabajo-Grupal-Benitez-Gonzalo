import type { Sequelize } from "sequelize";
import { Books } from "./book.models.js";
import { Notification } from "./notification.models.js";
import { Permission } from "./permission.js";
import { RolePermission } from "./role.models.js";
import { Role } from "./roles.models.js";
import { Suscription } from "./suscription.models.js";
import { User } from "./user.models.js";

export function initializeAssociations(): void {
    Role.hasMany(User, { foreignKey: "roleId", as: "users" });
    User.belongsTo(Role, { foreignKey: "roleId", as: "role" });

    Role.belongsToMany(Permission, {
        through: RolePermission,
        foreignKey: "roleId",
        otherKey: "permissionId",
        as: "permissions",
    });
    Permission.belongsToMany(Role, {
        through: RolePermission,
        foreignKey: "permissionId",
        otherKey: "roleId",
        as: "roles",
    });
    Role.hasMany(RolePermission, { foreignKey: "roleId", as: "rolePermissions" });
    RolePermission.belongsTo(Role, { foreignKey: "roleId", as: "role" });
    Permission.hasMany(RolePermission, {
        foreignKey: "permissionId",
        as: "rolePermissions",
    });
    RolePermission.belongsTo(Permission, {
        foreignKey: "permissionId",
        as: "permission",
    });

    User.hasMany(Suscription, { foreignKey: "userId", as: "subscriptions" });
    Suscription.belongsTo(User, { foreignKey: "userId", as: "user" });
    Books.hasMany(Suscription, { foreignKey: "bookId", as: "subscriptions" });
    Suscription.belongsTo(Books, { foreignKey: "bookId", as: "book" });

    User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
    Notification.belongsTo(User, { foreignKey: "userId", as: "user" });
    Books.hasMany(Notification, { foreignKey: "bookId", as: "notifications" });
    Notification.belongsTo(Books, { foreignKey: "bookId", as: "book" });
}

export function initializeModels(sequelize: Sequelize): void {
    Role.initialize(sequelize);
    Permission.initialize(sequelize);
    RolePermission.initialize(sequelize);
    User.initialize(sequelize);
    Books.initialize(sequelize);
    Suscription.initialize(sequelize);
    Notification.initialize(sequelize);

    initializeAssociations();
}