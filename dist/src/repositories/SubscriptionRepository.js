import { Books } from "../models/book.models.js";
import { Suscription } from "../models/suscription.models.js";
import { User } from "../models/user.models.js";
export class SubscriptionRepository {
    findByUserAndBook(userId, bookId) {
        return Suscription.findOne({ where: { userId, bookId } });
    }
    create(userId, bookId) {
        return Suscription.create({ userId, bookId });
    }
    delete(userId, bookId) {
        return Suscription.destroy({ where: { userId, bookId } });
    }
    findByUser(userId) {
        return Suscription.findAll({
            where: { userId },
            include: [{ model: Books, as: "book" }],
            order: [["id", "ASC"]],
        });
    }
    async findSubscribers(bookId) {
        const subscriptions = await Suscription.findAll({
            where: { bookId },
            attributes: ["userId"],
        });
        const userIds = [...new Set(subscriptions.map(({ userId }) => userId))];
        if (userIds.length === 0) {
            return [];
        }
        const users = await User.findAll({
            where: { id: userIds },
            attributes: ["id", "email"],
        });
        return users.map(({ id, email }) => ({ id, email }));
    }
}
//# sourceMappingURL=SubscriptionRepository.js.map