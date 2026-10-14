import type { Notification } from "../../models/notification.models.js";

export interface INotificationRepository {
  create(userId: number, bookId: number, message: string): Promise<Notification>;
  findByUser(userId: number): Promise<Notification[]>;
  unreadCount(userId: number): Promise<number>;
  findByIdAndUser(id: number, userId: number): Promise<Notification | null>;
  markAsRead(notification: Notification): Promise<Notification>;
}
