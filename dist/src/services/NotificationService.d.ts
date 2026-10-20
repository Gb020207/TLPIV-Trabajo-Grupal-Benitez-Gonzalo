import type { Notification } from "../models/notification.models.js";
import type { BookStatusChangedEvent } from "../observer/book-status-event.js";
import type { IObserver } from "../observer/IObserver.js";
import type { INotificationRepository } from "../repositories/interfaces/INotificationRepository.js";
import type { ISubscriptionRepository } from "../repositories/interfaces/ISubscriptionRepository.js";
import { NotifierFactory } from "../notifications/NotifierFactory.js";
export interface NotificationInbox {
    notifications: Notification[];
    unreadCount: number;
}
export declare class NotificationService implements IObserver {
    private readonly subscriptionRepository;
    private readonly notificationRepository;
    private readonly notifierFactory;
    constructor(subscriptionRepository: ISubscriptionRepository, notificationRepository: INotificationRepository, notifierFactory: NotifierFactory);
    update(event: BookStatusChangedEvent): Promise<void>;
    listMine(userId: number): Promise<NotificationInbox>;
    markAsRead(userId: number, notificationId: number): Promise<Notification>;
}
//# sourceMappingURL=NotificationService.d.ts.map