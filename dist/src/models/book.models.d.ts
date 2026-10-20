import { Model, Sequelize } from "sequelize";
import type { Optional } from "sequelize";
export type BookStatus = "DISPONIBLE" | "PRESTADO" | "EN_REPARACION";
interface BooksAttributes {
    id: number;
    title: string;
    description: string;
    status: BookStatus;
}
interface BookCreationAttributes extends Optional<BooksAttributes, "id" | "status"> {
}
export declare class Books extends Model<BooksAttributes, BookCreationAttributes> implements BooksAttributes {
    id: number;
    title: string;
    description: string;
    status: BookStatus;
    static initialize(sequelize: Sequelize): void;
}
export {};
//# sourceMappingURL=book.models.d.ts.map