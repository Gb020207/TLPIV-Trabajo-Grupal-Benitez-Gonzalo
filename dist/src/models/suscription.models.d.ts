import { Model, Sequelize } from "sequelize";
import type { Optional } from "sequelize";
interface SuscriptionAttributes {
    id: number;
    userId: number;
    bookId: number;
}
interface SuscriptionCreationAttributes extends Optional<SuscriptionAttributes, "id"> {
}
export declare class Suscription extends Model<SuscriptionAttributes, SuscriptionCreationAttributes> implements SuscriptionAttributes {
    id: number;
    userId: number;
    bookId: number;
    static initialize(sequelize: Sequelize): void;
}
export {};
//# sourceMappingURL=suscription.models.d.ts.map