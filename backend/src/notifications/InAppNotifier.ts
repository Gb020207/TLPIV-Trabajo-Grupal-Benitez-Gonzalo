import { Notification } from "../models/notification.models.js";
import type { INotifier, NotificationMessage } from "./INotifier.js";

export class InAppNotifier implements INotifier {
  async send(notification: NotificationMessage): Promise<void> {
    await Notification.create({
      userId: notification.userId,
      bookId: notification.bookId,
      message: notification.message,
    });
  }
}
