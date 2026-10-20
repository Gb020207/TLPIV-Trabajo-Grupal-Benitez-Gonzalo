import { Model, Sequelize } from "sequelize";
import type { Optional } from "sequelize";
interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    roleId: number;
}
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {
}
export declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    roleId: number;
    static initialize(sequelize: Sequelize): void;
}
export {};
//# sourceMappingURL=user.models.d.ts.map