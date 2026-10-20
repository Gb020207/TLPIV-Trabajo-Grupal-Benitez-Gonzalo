import { ServiceError } from "../services/ServiceError.js";
import { SubscriptionService } from "../services/SubscriptionService.js";
function parsePositiveInteger(value) {
    if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
        return null;
    }
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) ? parsed : null;
}
class SubscriptionControllers {
    subscriptionService;
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    async subscribe(request, response) {
        const userId = request.auth?.userId;
        const bookId = parsePositiveInteger(request.params.bookId);
        if (!userId) {
            response.status(401).json({ message: "Autenticación requerida" });
            return;
        }
        if (bookId === null) {
            response.status(400).json({ message: "El ID del libro no es válido" });
            return;
        }
        try {
            response
                .status(201)
                .json(await this.subscriptionService.subscribe(userId, bookId));
        }
        catch (error) {
            this.handleError(error, response, "Failed to subscribe user to book:");
        }
    }
    async unsubscribe(request, response) {
        const userId = request.auth?.userId;
        const bookId = parsePositiveInteger(request.params.bookId);
        if (!userId) {
            response.status(401).json({ message: "Autenticación requerida" });
            return;
        }
        if (bookId === null) {
            response.status(400).json({ message: "El ID del libro no es válido" });
            return;
        }
        try {
            await this.subscriptionService.unsubscribe(userId, bookId);
            response.status(204).end();
        }
        catch (error) {
            this.handleError(error, response, "Failed to unsubscribe user from book:");
        }
    }
    async listMine(request, response) {
        const userId = request.auth?.userId;
        if (!userId) {
            response.status(401).json({ message: "Autenticación requerida" });
            return;
        }
        try {
            response.status(200).json(await this.subscriptionService.listMine(userId));
        }
        catch (error) {
            this.handleError(error, response, "Failed to list user subscriptions:");
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
export default SubscriptionControllers;
//# sourceMappingURL=subscription.controllers.js.map