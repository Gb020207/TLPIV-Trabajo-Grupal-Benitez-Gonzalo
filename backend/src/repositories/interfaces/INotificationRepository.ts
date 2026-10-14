import type { Notification } from "../../models/notification.models.js";

export interface CreateNotificationData {
  userId: number;
  bookId: number;
  message: string;
}

export interface INotificationRepository {
  create(data: CreateNotificationData): Promise<Notification>;
  findByUser(userId: number): Promise<Notification[]>;
  markAsRead(id: number, userId: number): Promise<Notification | null>;
}
