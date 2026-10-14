import cors from "cors";
import express from "express";
import { createAuthRoutes } from "./routes/auth.routes.js";
import { createBooksRoutes } from "./routes/books.routes.js";
import { createNotificationRoutes } from "./routes/notification.routes.js";
import { createSubscriptionRoutes } from "./routes/subscription.routes.js";
import { createUserRoutes } from "./routes/user.routes.js";
import type { ApplicationServices } from "./services/ApplicationServices.js";

export function createApp(services: ApplicationServices): express.Express {
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

  app.use("/api/auth", createAuthRoutes(services.auth));
  app.use("/api/books", createBooksRoutes(services.books));
  app.use("/api/subscriptions", createSubscriptionRoutes(services.subscriptions));
  app.use("/api/notifications", createNotificationRoutes(services.notifications));
  app.use("/api/users", createUserRoutes(services.users));

  return app;
}
