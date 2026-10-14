import { Notification } from "../models/notification.models.js";
import type { BookStatusChangedEvent, IObserver } from "../observer/IObserver.js";
import type { NotifierFactory } from "../notifications/NotifierFactory.js";
import type { ISubscriptionRepository } from "../repositories/interfaces/ISubscriptionRepository.js";

export class NotificationService implements IObserver {
    constructor(
        private readonly subscriptions: ISubscriptionRepository,
        private readonly notifierFactory: NotifierFactory,
    ) {}

    async update(event: BookStatusChangedEvent): Promise<void> {
        const subscriptions = await this.subscriptions.findByBookId(event.bookId);

        for (const { userId } of subscriptions) {
            const notification = Notification.build({
                userId,
                bookId: event.bookId,
                message: `El libro "${event.bookTitle}" cambió su estado de ${event.previousStatus} a ${event.status}.`,
            });

            await this.notifierFactory.create("inapp").send(notification);
            await this.notifierFactory.create("console").send(notification);
        }
    }
}
