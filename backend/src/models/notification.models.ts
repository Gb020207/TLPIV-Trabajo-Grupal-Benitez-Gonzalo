import { Model,Optional,DataType,Sequelize, DataTypes } from "sequelize";

interface NotificationAtrributes{
    id:number;
    userId:number;
    bookId:number;
    message:string;
    read:boolean;
}

interface NotificationCreationAtrributes extends Optional<NotificationAtrributes, "id" | "read">{}

export class Notification extends Model<NotificationAtrributes,NotificationCreationAtrributes> implements NotificationAtrributes {
    declare id: number;
    declare userId: number;
    declare bookId: number;
    declare message: string;
    declare read: boolean;

    static initialize(sequelize:Sequelize):void {
        Notification.init({
            id:{type: DataTypes.INTEGER,autoIncrement:true,primaryKey:true},
            userId:{type:DataTypes.INTEGER,allowNull:false,field:"user_id"},
            bookId:{type:DataTypes.INTEGER,allowNull:false,field:"book_id"},
            message:{type:DataTypes.TEXT,allowNull:false},
            read:{type:DataTypes.BOOLEAN,allowNull:false,defaultValue:false}
        },
    {
        sequelize,
        tableName:"notifications",
        timestamps:true,
    })
    }
}