import { Model, Sequelize } from "sequelize";
import type { Optional } from "sequelize";
interface PermissionAttributes {
    id: number;
    name: string;
}
interface PermissionCreationAttributes extends Optional<PermissionAttributes, "id"> {
}
export declare class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
    id: number;
    name: string;
    static initialize(sequelize: Sequelize): void;
}
export {};
//# sourceMappingURL=permission.d.ts.map