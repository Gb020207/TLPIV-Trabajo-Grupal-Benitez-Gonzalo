import cors from "cors";
import express from "express";
import AdminUserRoutes from "./routes/admin-users.routes.js";
import authRoutes from "./routes/auth.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";
import subscriptionsRoutes from "./routes/subscriptions.routes.js";
import { createBooksRoutes } from "./routes/books.routes.js";
import type BookControllers from "./controllers/book.controllers.js";

export function createApp(bookControllers: BookControllers): express.Express {
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

  app.use("/api/auth", authRoutes);
  app.use("/api/books", createBooksRoutes(bookControllers));
  app.use("/api/subscriptions", subscriptionsRoutes);
  app.use("/api/notifications", notificationsRoutes);
  app.use("/api/users", AdminUserRoutes);

  return app;
}
