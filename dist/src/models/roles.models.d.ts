import { Model, Sequelize } from "sequelize";
import type { Optional } from "sequelize";
interface RoleAttributes {
    id: number;
    name: string;
}
interface RoleCreationAttributes extends Optional<RoleAttributes, "id"> {
}
export declare class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    id: number;
    name: string;
    static initialize(sequelize: Sequelize): void;
}
export {};
//# sourceMappingURL=roles.models.d.ts.map