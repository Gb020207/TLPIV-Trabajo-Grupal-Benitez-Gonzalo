import { DataTypes, Model, Sequelize } from "sequelize";
export class Notification extends Model {
    static initialize(sequelize) {
        Notification.init({
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            userId: { type: DataTypes.INTEGER, allowNull: false, field: "user_id" },
            bookId: { type: DataTypes.INTEGER, allowNull: false, field: "book_id" },
            message: { type: DataTypes.TEXT, allowNull: false },
            read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
        }, {
            sequelize,
            tableName: "notifications",
            timestamps: true,
        });
    }
}
//# sourceMappingURL=notification.models.js.map