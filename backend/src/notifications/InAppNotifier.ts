import type { INotifier, NotificationMessage } from "./INotifier.js";
import type { INotificationRepository } from "../repositories/interfaces/INotificationRepository.js";

export class InAppNotifier implements INotifier {
  constructor(
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async send(notification: NotificationMessage): Promise<void> {
    await this.notificationRepository.create({
      userId: notification.userId,
      bookId: notification.bookId,
      message: notification.message,
    });
  }
}
