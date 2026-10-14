import { Suscription } from "../models/suscription.models.js";
import { User } from "../models/user.models.js";
import type { BookStatusChangedEvent } from "../observer/book-status-event.js";
import type { IObserver } from "../observer/IObserver.js";
import { NotifierFactory } from "../notifications/NotifierFactory.js";

export class NotificationService implements IObserver {
  constructor(private readonly notifierFactory: NotifierFactory) {}

  async update(event: BookStatusChangedEvent): Promise<void> {
    const subscriptions = await Suscription.findAll({
      where: { bookId: event.bookId },
      attributes: ["userId"],
    });
    const userIds = [...new Set(subscriptions.map(({ userId }) => userId))];
    if (userIds.length === 0) {
      return;
    }

    const users = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "email"],
    });
    const inAppNotifier = this.notifierFactory.create("inapp");
    const consoleNotifier = this.notifierFactory.create("console");
    for (const user of users) {
      const notification = {
        ...event,
        userId: user.id,
        userEmail: user.email,
        bookTitle: event.bookTitle,
        message: `El libro "${event.bookTitle}" cambió de ${event.previousStatus} a ${event.newStatus}.`,
      };
      await inAppNotifier.send(notification);
      await consoleNotifier.send(notification);
    }
  }
}
