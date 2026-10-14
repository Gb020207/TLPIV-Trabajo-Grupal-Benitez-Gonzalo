import cors from "cors";
import express from "express";
import type AdminUserControllers from "./controllers/admin-user.controllers.js";
import type AuthControllers from "./controllers/auth.controllers.js";
import type NotificationControllers from "./controllers/notification.controllers.js";
import type SubscriptionControllers from "./controllers/subscription.controllers.js";
import { createAdminUsersRoutes } from "./routes/admin-users.routes.js";
import { createAuthRoutes } from "./routes/auth.routes.js";
import { createBooksRoutes } from "./routes/books.routes.js";
import { createNotificationsRoutes } from "./routes/notifications.routes.js";
import { createSubscriptionsRoutes } from "./routes/subscriptions.routes.js";
import type BookControllers from "./controllers/book.controllers.js";

export interface AppControllers {
  auth: AuthControllers;
  books: BookControllers;
  subscriptions: SubscriptionControllers;
  notifications: NotificationControllers;
  adminUsers: AdminUserControllers;
}

export function createApp(controllers: AppControllers): express.Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.status(200).json({
      status: "ok",
      ok: true,
      message: "API funcionando",
    });
  });

  app.use("/api/auth", createAuthRoutes(controllers.auth));
  app.use("/api/books", createBooksRoutes(controllers.books));
  app.use(
    "/api/subscriptions",
    createSubscriptionsRoutes(controllers.subscriptions),
  );
  app.use(
    "/api/notifications",
    createNotificationsRoutes(controllers.notifications),
  );
  app.use("/api/users", createAdminUsersRoutes(controllers.adminUsers));

  return app;
}
