import { Sequelize } from "sequelize";
export declare class DatabaseConnection {
    private static instance;
    private readonly sequelize;
    private constructor();
    static getInstance(): DatabaseConnection;
    getConnection(): Sequelize;
    connect(): Promise<void>;
}
//# sourceMappingURL=db.d.ts.map