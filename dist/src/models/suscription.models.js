import { DataTypes, Model, Sequelize } from "sequelize";
export class Suscription extends Model {
    static initialize(sequelize) {
        Suscription.init({
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            userId: { type: DataTypes.INTEGER, allowNull: false, field: "user_id" },
            bookId: { type: DataTypes.INTEGER, allowNull: false, field: "book_id" },
        }, {
            sequelize,
            tableName: "suscriptions",
            timestamps: true,
            indexes: [{
                    unique: true,
                    fields: ["user_id", "book_id"]
                }]
        });
    }
}
//# sourceMappingURL=suscription.models.js.map