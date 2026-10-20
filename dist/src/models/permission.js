import { DataTypes, Model, Sequelize } from "sequelize";
export class Permission extends Model {
    static initialize(sequelize) {
        Permission.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
        }, {
            sequelize,
            tableName: "permissions",
            timestamps: true,
        });
    }
}
//# sourceMappingURL=permission.js.map