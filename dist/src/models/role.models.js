import { DataTypes, Model, Sequelize } from "sequelize";
export class RolePermission extends Model {
    static initialize(sequelize) {
        RolePermission.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: "role_id",
            },
            permissionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: "permission_id",
            },
        }, {
            sequelize,
            tableName: "role_permissions",
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: ["role_id", "permission_id"],
                },
            ],
        });
    }
}
//# sourceMappingURL=role.models.js.map