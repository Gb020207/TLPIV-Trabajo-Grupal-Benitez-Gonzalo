import { Router } from "express";
import NotificationControllers from "../controllers/notification.controllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

const notificationsRoutes = Router();
const notificationsController = new NotificationControllers();

notificationsRoutes.use(authenticate, authorize("notification:read"));
notificationsRoutes.get("/", (request, response) =>
  notificationsController.listMine(request, response),
);
notificationsRoutes.patch("/:id/read", (request, response) =>
  notificationsController.markAsRead(request, response),
);

export default notificationsRoutes;
