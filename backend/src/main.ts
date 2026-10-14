import { createApp } from "./app.js";
import { DatabaseConnection } from "./config/db.js";
import { env } from "./config/env.js";
import { seedRolesAndPermissions } from "./database/seed.js";
import { initializeModels } from "./models/associations.js";
import { EventPublisher } from "./observer/EventPublisher.js";
import { NotifierFactory } from "./notifications/NotifierFactory.js";
import { NotificationService } from "./services/NotificationService.js";
import { BookRepository } from "./repositories/BookRepository.js";
import { NotificationRepository } from "./repositories/NotificationRepository.js";
import { RoleRepository } from "./repositories/RoleRepository.js";
import { SubscriptionRepository } from "./repositories/SubscriptionRepository.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { AuthService } from "./services/AuthService.js";
import { BookService } from "./services/BookService.js";
import { NotificationInboxService } from "./services/NotificationInboxService.js";
import { SubscriptionService } from "./services/SubscriptionService.js";
import { UserService } from "./services/UserService.js";

async function start(): Promise<void> {
    if (!Number.isInteger(env.apiPort) || env.apiPort < 1 || env.apiPort > 65535) {
        throw new Error(`Invalid API_PORT: ${env.apiPort}`);
    }

    const database = DatabaseConnection.getInstance();
    const sequelize = database.getConnection();

    initializeModels(sequelize);
    await database.connect();
    await sequelize.sync();
    await seedRolesAndPermissions(sequelize, env.seedUsers);

    const eventPublisher = new EventPublisher();
    const books = new BookRepository();
    const users = new UserRepository();
    const roles = new RoleRepository();
    const subscriptions = new SubscriptionRepository();
    const notifications = new NotificationRepository();
    const notifierFactory = new NotifierFactory(notifications);
    eventPublisher.attach(new NotificationService(subscriptions, notifierFactory));

    const app = createApp({
        auth: new AuthService(users, roles, env.jwtSecret),
        books: new BookService(books, eventPublisher),
        notifications: new NotificationInboxService(notifications),
        subscriptions: new SubscriptionService(subscriptions, books),
        users: new UserService(users, roles),
    });
    app.listen(env.apiPort, () => {
        console.log(`Backend listening on port ${env.apiPort}`);
    });
}

start().catch((error: unknown) => {
    console.error("Backend startup failed:", error);
    process.exitCode = 1;
});
