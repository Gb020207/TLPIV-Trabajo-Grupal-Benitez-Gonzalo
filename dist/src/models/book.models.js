import { DataTypes, Model, Sequelize } from "sequelize";
export class Books extends Model {
    static initialize(sequelize) {
        Books.init({
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            title: { type: DataTypes.STRING(200), allowNull: false },
            description: { type: DataTypes.TEXT, allowNull: false },
            status: { type: DataTypes.ENUM("DISPONIBLE", "PRESTADO", "EN_REPARACION"), allowNull: false, defaultValue: "DISPONIBLE" },
        }, {
            sequelize,
            tableName: "books",
            timestamps: true,
        });
    }
}
//# sourceMappingURL=book.models.js.map