import { Notification } from "../models/notification.models.js";
import type {
  CreateNotificationData,
  INotificationRepository,
} from "./interfaces/INotificationRepository.js";

export class NotificationRepository implements INotificationRepository {
  create(data: CreateNotificationData): Promise<Notification> {
    return Notification.create(data);
  }

  findByUser(userId: number): Promise<Notification[]> {
    return Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
  }

  async markAsRead(id: number, userId: number): Promise<Notification | null> {
    const notification = await Notification.findOne({
      where: { id, userId },
    });
    if (!notification) {
      return null;
    }

    if (!notification.read) {
      await notification.update({ read: true });
    }
    return notification;
  }
}
