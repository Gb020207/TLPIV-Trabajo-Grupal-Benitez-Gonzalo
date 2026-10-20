import cors from "cors";
import express from "express";
import { createAdminUsersRoutes } from "./routes/admin-users.routes.js";
import { createAuthRoutes } from "./routes/auth.routes.js";
import { createBooksRoutes } from "./routes/books.routes.js";
import { createNotificationsRoutes } from "./routes/notifications.routes.js";
import { createSubscriptionsRoutes } from "./routes/subscriptions.routes.js";
export function createApp(controllers) {
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
    app.use("/api/subscriptions", createSubscriptionsRoutes(controllers.subscriptions));
    app.use("/api/notifications", createNotificationsRoutes(controllers.notifications));
    app.use("/api/users", createAdminUsersRoutes(controllers.adminUsers));
    return app;
}
//# sourceMappingURL=app.js.map