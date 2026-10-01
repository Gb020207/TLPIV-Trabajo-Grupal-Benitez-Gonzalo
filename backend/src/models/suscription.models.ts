import { Model, Sequelize, DataTypes } from "sequelize";
import type { Optional } from "sequelize"

interface SuscriptionAttributes{
    id: number;
    userId:number;
    bookId:number;
}

interface SuscriptionCreationAttributes extends Optional<SuscriptionAttributes,"id"> {}

export class Suscription extends Model<SuscriptionAttributes,SuscriptionCreationAttributes> implements SuscriptionAttributes{
    declare id: number;
    declare userId: number;
    declare bookId: number;

    static initialize(sequelize:Sequelize):void {
         Suscription.init({
            id:{type:DataTypes.INTEGER,autoIncrement:true,primaryKey:true},
            userId:{type:DataTypes.INTEGER,allowNull:false,field:"user_id"},
            bookId:{type:DataTypes.INTEGER,allowNull:false,field:"book_id"},

         },{
            sequelize,
            tableName:"suscriptions",
            timestamps:true,

            indexes:[{
                unique:true,
                fields:["user_id","book_id"]
            }]
         })
    }
}