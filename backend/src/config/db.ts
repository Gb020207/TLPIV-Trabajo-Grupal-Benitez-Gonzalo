import { Sequelize } from "sequelize";
import { env } from "./env.js";
export class DatabaseConnection{
    private static instance: DatabaseConnection | null=null;

    private readonly sequelize: Sequelize;

    private constructor(){
        this.sequelize = new Sequelize({
            dialect: "postgres",
            host: env.dbHost,
            port: env.dbPort,
            username: env.dbUser,
            password: env.dbPassword,
            database: env.dbName,

            logging:false,
        })
    }
    // Aqui es donde se aplica el patron singleton 
    public static getInstance() : DatabaseConnection {
        if(DatabaseConnection.instance === null){
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance
    }

    public getConnection() : Sequelize {
        return this.sequelize;
    }

    public async connect() : Promise<void> {
        await this.sequelize.authenticate();
    }

}

