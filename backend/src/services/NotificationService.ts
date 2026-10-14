import type { Notification } from "../models/notification.models.js";
import type { BookStatusChangedEvent } from "../observer/book-status-event.js";
import type { IObserver } from "../observer/IObserver.js";
import type { INotificationRepository } from "../repositories/interfaces/INotificationRepository.js";
import type { ISubscriptionRepository } from "../repositories/interfaces/ISubscriptionRepository.js";
import { NotifierFactory } from "../notifications/NotifierFactory.js";
import { ServiceError } from "./ServiceError.js";

export interface NotificationInbox {
  notifications: Notification[];
  unreadCount: number;
}

export class NotificationService implements IObserver {
  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly notificationRepository: INotificationRepository,
    private readonly notifierFactory: NotifierFactory,
  ) {}

  async update(event: BookStatusChangedEvent): Promise<void> {
    const subscribers = await this.subscriptionRepository.findSubscribers(
      event.bookId,
    );
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

  async listMine(userId: number): Promise<NotificationInbox> {
    const notifications = await this.notificationRepository.findByUser(userId);
    return {
      notifications,
      unreadCount: notifications.filter(({ read }) => !read).length,
    };
  }

  async markAsRead(userId: number, notificationId: number): Promise<Notification> {
    const notification = await this.notificationRepository.markAsRead(
      notificationId,
      userId,
    );
    if (!notification) {
      throw new ServiceError("Notificación no encontrada", 404);
    }
    return notification;
  }
}
