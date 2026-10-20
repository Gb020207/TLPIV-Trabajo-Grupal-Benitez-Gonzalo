import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
export function createNotificationsRoutes(notificationsController) {
    const notificationsRoutes = Router();
    notificationsRoutes.use(authenticate, authorize("notification:read"));
    notificationsRoutes.get("/", (request, response) => notificationsController.listMine(request, response));
    notificationsRoutes.patch("/:id/read", (request, response) => notificationsController.markAsRead(request, response));
    return notificationsRoutes;
}
//# sourceMappingURL=notifications.routes.js.map