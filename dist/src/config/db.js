import { Sequelize } from "sequelize";
import { env } from "./env.js";
export class DatabaseConnection {
    static instance = null;
    sequelize;
    constructor() {
        this.sequelize = new Sequelize({
            dialect: "postgres",
            host: env.dbHost,
            port: env.dbPort,
            username: env.dbUser,
            password: env.dbPassword,
            database: env.dbName,
            logging: false,
        });
    }
    // Aqui es donde se aplica el patron singleton 
    static getInstance() {
        if (DatabaseConnection.instance === null) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
    getConnection() {
        return this.sequelize;
    }
    async connect() {
        await this.sequelize.authenticate();
    }
}
//# sourceMappingURL=db.js.map