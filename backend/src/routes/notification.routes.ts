import { Router } from "express";
import NotificationControllers from "../controllers/notification.controllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import type { NotificationInboxService } from "../services/NotificationInboxService.js";

export function createNotificationRoutes(service: NotificationInboxService): Router {
  const notificationRoutes = Router();
  const controllers = new NotificationControllers(service);

  notificationRoutes.use(authenticate, authorize("notification:read"));
  notificationRoutes.get("/", (request, response) =>
    controllers.listMine(request, response),
  );
  notificationRoutes.get("/unread-count", (request, response) =>
    controllers.unreadCount(request, response),
  );
  notificationRoutes.patch("/:id/read", (request, response) =>
    controllers.markAsRead(request, response),
  );

  return notificationRoutes;
}
