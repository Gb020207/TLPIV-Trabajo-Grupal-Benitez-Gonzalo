import type { INotifier } from "./INotifier.js";
import type { Notification } from "../models/notification.models.js";

export class ConsoleNotifierAdapter implements INotifier {
    async send(notification: Notification): Promise<void> {
        console.log(
            `[NOTIFICACIÓN] Usuario #${notification.userId} | Libro #${notification.bookId} | ${notification.message}`,
        );
    }
}
