import type { INotifier } from "./INotifier.js";
import type { Notification } from "../models/notification.models.js";
import type { INotificationRepository } from "../repositories/interfaces/INotificationRepository.js";

export class InAppNotifier implements INotifier {
    constructor(private readonly notifications: INotificationRepository) {}

    async send(notification: Notification): Promise<void> {
        await this.notifications.create(
            notification.userId,
            notification.bookId,
            notification.message,
        );
    }
}
