import { NotifierFactory } from "../notifications/NotifierFactory.js";
import { ServiceError } from "./ServiceError.js";
export class NotificationService {
    subscriptionRepository;
    notificationRepository;
    notifierFactory;
    constructor(subscriptionRepository, notificationRepository, notifierFactory) {
        this.subscriptionRepository = subscriptionRepository;
        this.notificationRepository = notificationRepository;
        this.notifierFactory = notifierFactory;
    }
    async update(event) {
        const subscribers = await this.subscriptionRepository.findSubscribers(event.bookId);
        const inAppNotifier = this.notifierFactory.create("inapp");
        const consoleNotifier = this.notifierFactory.create("console");
        for (const subscriber of subscribers) {
            const notification = {
                ...event,
                userId: subscriber.id,
                userEmail: subscriber.email,
                message: `El libro "${event.bookTitle}" cambió de ${event.previousStatus} a ${event.newStatus}.`,
            };
            await inAppNotifier.send(notification);
            await consoleNotifier.send(notification);
        }
    }
    async listMine(userId) {
        const notifications = await this.notificationRepository.findByUser(userId);
        return {
            notifications,
            unreadCount: notifications.filter(({ read }) => !read).length,
        };
    }
    async markAsRead(userId, notificationId) {
        const notification = await this.notificationRepository.markAsRead(notificationId, userId);
        if (!notification) {
            throw new ServiceError("Notificación no encontrada", 404);
        }
        return notification;
    }
}
//# sourceMappingURL=NotificationService.js.map