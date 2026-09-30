import { Model,DataType,Optional,Sequelize, DataTypes, } from "sequelize";

interface RoleAttributes{
    id: number;
    name: string;
}

interface RoleCreationAttributes extends Optional<RoleAttributes,"id">{}

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes{
    declare id: number;
    declare name: string;

    static initialize(sequelize: Sequelize): void {
        Role.init({
            id:{type:DataTypes.INTEGER,autoIncrement:true,primaryKey:true},
            name:{type:DataTypes.STRING(50),allowNull:false,unique:true},

        },{
            sequelize,
            tableName:"roles",
            timestamps: true
        })
    }
}