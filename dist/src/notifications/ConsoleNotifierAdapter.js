export class ConsoleNotifierAdapter {
    async send(notification) {
        console.log(`[NOTIFICACIÓN] Para: ${notification.userEmail} | Libro: ${notification.bookTitle} (#${notification.bookId}) | Estado: ${notification.previousStatus} → ${notification.newStatus}`);
    }
}
//# sourceMappingURL=ConsoleNotifierAdapter.js.map