import { DataTypes, Model, Sequelize } from "sequelize";
import type { Optional } from "sequelize"


interface UserAttributes{
    id:number,
    name:string;
    email:string;
    password:string;
    roleId:number

}

interface UserCreationAttributes extends Optional<UserAttributes,"id">{}

export class User extends Model<UserAttributes,UserCreationAttributes> implements UserAttributes{
    declare id: number;
    declare name: string;
    declare email: string;
    declare password: string;
    declare roleId: number;

    static initialize(sequelize:Sequelize):void{
        User.init({
            id:{type:DataTypes.INTEGER,autoIncrement:true,primaryKey:true},
            name:{type:DataTypes.STRING(50),allowNull:false},
            email:{type:DataTypes.STRING,allowNull:false,unique:true},
            password:{type:DataTypes.STRING(255),allowNull:false},
            roleId:{type:DataTypes.INTEGER,allowNull:false,field:"role_id"},
    
        },{
            sequelize,
            tableName:"users",
            timestamps:true,
        })
    }
}

