import { NotificationService } from "../services/NotificationService.js";
import { ServiceError } from "../services/ServiceError.js";
function parsePositiveInteger(value) {
    if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
        return null;
    }
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) ? parsed : null;
}
class NotificationControllers {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async listMine(request, response) {
        const userId = request.auth?.userId;
        if (!userId) {
            response.status(401).json({ message: "Autenticación requerida" });
            return;
        }
        try {
            response
                .status(200)
                .json(await this.notificationService.listMine(userId));
        }
        catch (error) {
            this.handleError(error, response, "Failed to list notifications:");
        }
    }
    async markAsRead(request, response) {
        const userId = request.auth?.userId;
        const notificationId = parsePositiveInteger(request.params.id);
        if (!userId) {
            response.status(401).json({ message: "Autenticación requerida" });
            return;
        }
        if (notificationId === null) {
            response.status(400).json({
                message: "El ID de la notificación no es válido",
            });
            return;
        }
        try {
            response
                .status(200)
                .json(await this.notificationService.markAsRead(userId, notificationId));
        }
        catch (error) {
            this.handleError(error, response, "Failed to mark notification as read:");
        }
    }
    handleError(error, response, context) {
        if (error instanceof ServiceError) {
            response.status(error.statusCode).json({ message: error.message });
            return;
        }
        console.error(context, error);
        response.status(500).json({ message: "Error interno del servidor" });
    }
}
export default NotificationControllers;
//# sourceMappingURL=notification.controllers.js.map