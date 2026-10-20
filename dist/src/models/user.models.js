import { DataTypes, Model, Sequelize } from "sequelize";
export class User extends Model {
    static initialize(sequelize) {
        User.init({
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            name: { type: DataTypes.STRING(50), allowNull: false },
            email: { type: DataTypes.STRING, allowNull: false, unique: true },
            password: { type: DataTypes.STRING(255), allowNull: false },
            roleId: { type: DataTypes.INTEGER, allowNull: false, field: "role_id" },
        }, {
            sequelize,
            tableName: "users",
            timestamps: true,
        });
    }
}
//# sourceMappingURL=user.models.js.map