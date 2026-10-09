import { Model, DataTypes, Sequelize } from "sequelize";
import type { Optional } from "sequelize"

interface RolePermissionAttributes {
  id: number;
  roleId: number;
  permissionId: number;
}

interface RolePermissionCreationAttributes extends Optional<
  RolePermissionAttributes,
  "id"
> {}

export class RolePermission
  extends Model<RolePermissionAttributes, RolePermissionCreationAttributes>
  implements RolePermissionAttributes
{
  declare id: number;
  declare roleId: number;
  declare permissionId: number;

  static initialize(sequelize: Sequelize): void {
    RolePermission.init(
      {
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
      },
      {
        sequelize,
        tableName: "role_permissions",
        timestamps: false,

        indexes: [
          {
            unique: true,
            fields: ["role_id", "permission_id"],
          },
        ],
      },
    );
  }
}

