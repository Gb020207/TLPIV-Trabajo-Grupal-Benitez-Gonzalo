import type { Notification } from "../models/notification.models.js";
import type { INotificationRepository } from "../repositories/interfaces/INotificationRepository.js";

export class NotificationInboxService {
  constructor(private readonly notifications: INotificationRepository) {}

  list(userId: number): Promise<Notification[]> {
    return this.notifications.findByUser(userId);
  }

  unreadCount(userId: number): Promise<number> {
    return this.notifications.unreadCount(userId);
  }

  async markAsRead(id: number, userId: number): Promise<Notification | null> {
    const notification = await this.notifications.findByIdAndUser(id, userId);
    return notification ? this.notifications.markAsRead(notification) : null;
  }
}
