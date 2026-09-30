import { Model,Optional,DataType,Sequelize, DataTypes } from "sequelize";
export type BookStatus =|"DISPONIBLE"|"PRESTADO"|"EN_REPARACION"
interface BooksAttributes{
    id:number;
    title:string;
    description: string;
    status: BookStatus;
}
interface BookCreationAttributes extends Optional<BooksAttributes,"id" | "status">{}

export class Books extends Model<BooksAttributes,BookCreationAttributes> implements BooksAttributes{
    declare id: number;
    declare title: string;
    declare description: string;
    declare status: BookStatus;
    static initialize(sequelize:Sequelize):void {
        Books.init({
            id:{type:DataTypes.INTEGER, autoIncrement:true,primaryKey:true},
            title:{type:DataTypes.STRING(200),allowNull:false},
            description:{type:DataTypes.TEXT,allowNull:false},
            status:{type:DataTypes.ENUM("DISPONIBLE","PRESTADO","EN_REPARACION"),allowNull:false,defaultValue:"DISPONIBLE"},

        },{
            sequelize,
            tableName:"books",
            timestamps:true,
        })
    }
    
}