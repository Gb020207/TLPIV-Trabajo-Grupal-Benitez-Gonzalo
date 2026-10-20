import { DataTypes, Model, Sequelize } from "sequelize";
export class Role extends Model {
    static initialize(sequelize) {
        Role.init({
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
        }, {
            sequelize,
            tableName: "roles",
            timestamps: true
        });
    }
}
//# sourceMappingURL=roles.models.js.map