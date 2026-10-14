import { createApp } from "./app.js";
import { DatabaseConnection } from "./config/db.js";
import { env } from "./config/env.js";
import { seedRolesAndPermissions } from "./database/seed.js";
import { initializeModels } from "./models/associations.js";

async function start(): Promise<void> {
    if (!Number.isInteger(env.apiPort) || env.apiPort < 1 || env.apiPort > 65535) {
        throw new Error(`Invalid API_PORT: ${env.apiPort}`);
    }

    const database = DatabaseConnection.getInstance();
    const sequelize = database.getConnection();

    initializeModels(sequelize);
    await database.connect();
    await sequelize.sync();
    await seedRolesAndPermissions(sequelize);

    const app = createApp();
    app.listen(env.apiPort, () => {
        console.log(`Backend listening on port ${env.apiPort}`);
    });
}

start().catch((error: unknown) => {
    console.error("Backend startup failed:", error);
    process.exitCode = 1;
});
