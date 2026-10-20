export class InAppNotifier {
    notificationRepository;
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async send(notification) {
        await this.notificationRepository.create({
            userId: notification.userId,
            bookId: notification.bookId,
            message: notification.message,
        });
    }
}
//# sourceMappingURL=InAppNotifier.js.map