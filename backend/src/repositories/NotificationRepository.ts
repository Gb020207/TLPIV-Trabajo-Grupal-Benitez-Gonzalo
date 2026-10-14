import { Notification } from "../models/notification.models.js";
import type { INotificationRepository } from "./interfaces/INotificationRepository.js";

export class NotificationRepository implements INotificationRepository {
  create(userId: number, bookId: number, message: string): Promise<Notification> {
    return Notification.create({ userId, bookId, message });
  }

  findByUser(userId: number): Promise<Notification[]> {
    return Notification.findAll({ where: { userId }, order: [["createdAt", "DESC"]] });
  }

  unreadCount(userId: number): Promise<number> {
    return Notification.count({ where: { userId, read: false } });
  }

  findByIdAndUser(id: number, userId: number): Promise<Notification | null> {
    return Notification.findOne({ where: { id, userId } });
  }

  markAsRead(notification: Notification): Promise<Notification> {
    return notification.update({ read: true });
  }
}
