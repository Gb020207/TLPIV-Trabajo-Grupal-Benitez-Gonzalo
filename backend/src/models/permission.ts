import { DataTypes, Model, Sequelize,Optional } from "sequelize";

interface PermissionAttributes{
    id:number;
    name:string;
}

interface PermissionCreationAttributes extends Optional<PermissionAttributes,"id"> {}

export class Permission extends Model<PermissionAttributes,PermissionCreationAttributes> implements PermissionAttributes{
    declare id: number;
    declare name: string;
    static initialize(sequelize:Sequelize):void{
        Permission.init({
            id:{
                type:DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true,
            },
            name:{
                type:DataTypes.STRING(100),
                allowNull: false,
                unique:true,
            },
        },
    {
        sequelize,
        tableName: "permissions",
        timestamps: true,
    });
    
}
}