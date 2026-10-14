import { createApp, type AppControllers } from "./app.js";
import AdminUserControllers from "./controllers/admin-user.controllers.js";
import AuthControllers from "./controllers/auth.controllers.js";
import BookControllers from "./controllers/book.controllers.js";
import NotificationControllers from "./controllers/notification.controllers.js";
import SubscriptionControllers from "./controllers/subscription.controllers.js";
import { DatabaseConnection } from "./config/db.js";
import { env } from "./config/env.js";
import { seedRolesAndPermissions } from "./database/seed.js";
import { initializeModels } from "./models/associations.js";
import { EventPublisher } from "./observer/EventPublisher.js";
import { NotifierFactory } from "./notifications/NotifierFactory.js";
import { BookRepository } from "./repositories/BookRepository.js";
import { NotificationRepository } from "./repositories/NotificationRepository.js";
import { RoleRepository } from "./repositories/RoleRepository.js";
import { SubscriptionRepository } from "./repositories/SubscriptionRepository.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { AuthService } from "./services/AuthService.js";
import { BookService } from "./services/BookService.js";
import { NotificationService } from "./services/NotificationService.js";
import { SubscriptionService } from "./services/SubscriptionService.js";
import { UserService } from "./services/UserService.js";

async function start(): Promise<void> {
  if (
    !Number.isInteger(env.apiPort) ||
    env.apiPort < 1 ||
    env.apiPort > 65535
  ) {
    throw new Error(`Invalid API_PORT: ${env.apiPort}`);
  }

  const database = DatabaseConnection.getInstance();
  const sequelize = database.getConnection();

  initializeModels(sequelize);
  await database.connect();
  await sequelize.sync();
  await seedRolesAndPermissions(sequelize);

  const bookRepository = new BookRepository();
  const userRepository = new UserRepository();
  const roleRepository = new RoleRepository();
  const subscriptionRepository = new SubscriptionRepository();
  const notificationRepository = new NotificationRepository();

  const notifierFactory = new NotifierFactory(notificationRepository);
  const notificationService = new NotificationService(
    subscriptionRepository,
    notificationRepository,
    notifierFactory,
  );
  const eventPublisher = new EventPublisher();
  eventPublisher.attach(notificationService);

  const authService = new AuthService(userRepository, roleRepository);
  const bookService = new BookService(bookRepository, eventPublisher);
  const subscriptionService = new SubscriptionService(
    subscriptionRepository,
    bookRepository,
  );
  const userService = new UserService(userRepository, roleRepository);

  const controllers: AppControllers = {
    auth: new AuthControllers(authService),
    books: new BookControllers(bookService),
    subscriptions: new SubscriptionControllers(subscriptionService),
    notifications: new NotificationControllers(notificationService),
    adminUsers: new AdminUserControllers(userService),
  };

  const app = createApp(controllers);
  app.listen(env.apiPort, () => {
    console.log(`Backend listening on port ${env.apiPort}`);
  });
}

start().catch((error: unknown) => {
  console.error("Backend startup failed:", error);
  process.exitCode = 1;
});
