import { Notification } from "../models/notification.models.js";
export class NotificationRepository {
    create(data) {
        return Notification.create(data);
    }
    findByUser(userId) {
        return Notification.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]],
        });
    }
    async markAsRead(id, userId) {
        const notification = await Notification.findOne({
            where: { id, userId },
        });
        if (!notification) {
            return null;
        }
        if (!notification.read) {
            await notification.update({ read: true });
        }
        return notification;
    }
}
//# sourceMappingURL=NotificationRepository.js.map