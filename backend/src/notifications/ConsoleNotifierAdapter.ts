import type { INotifier, NotificationMessage } from "./INotifier.js";

export class ConsoleNotifierAdapter implements INotifier {
  async send(notification: NotificationMessage): Promise<void> {
    console.log(
      `[NOTIFICACIÓN] Para: ${notification.userEmail} | Libro: ${notification.bookTitle} (#${notification.bookId}) | Estado: ${notification.previousStatus} → ${notification.newStatus}`,
    );
  }
}
