import { Model, Sequelize } from "sequelize";
import type { Optional } from "sequelize";
interface RolePermissionAttributes {
    id: number;
    roleId: number;
    permissionId: number;
}
interface RolePermissionCreationAttributes extends Optional<RolePermissionAttributes, "id"> {
}
export declare class RolePermission extends Model<RolePermissionAttributes, RolePermissionCreationAttributes> implements RolePermissionAttributes {
    id: number;
    roleId: number;
    permissionId: number;
    static initialize(sequelize: Sequelize): void;
}
export {};
//# sourceMappingURL=role.models.d.ts.map