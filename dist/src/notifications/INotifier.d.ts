import type { BookStatusChangedEvent } from "../observer/book-status-event.js";
export interface NotificationMessage extends BookStatusChangedEvent {
    userId: number;
    userEmail: string;
    message: string;
}
export interface INotifier {
    send(notification: NotificationMessage): Promise<void>;
}
//# sourceMappingURL=INotifier.d.ts.map