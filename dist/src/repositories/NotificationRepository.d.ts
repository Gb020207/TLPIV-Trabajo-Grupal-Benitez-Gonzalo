import { Notification } from "../models/notification.models.js";
import type { CreateNotificationData, INotificationRepository } from "./interfaces/INotificationRepository.js";
export declare class NotificationRepository implements INotificationRepository {
    create(data: CreateNotificationData): Promise<Notification>;
    findByUser(userId: number): Promise<Notification[]>;
    markAsRead(id: number, userId: number): Promise<Notification | null>;
}
//# sourceMappingURL=NotificationRepository.d.ts.map