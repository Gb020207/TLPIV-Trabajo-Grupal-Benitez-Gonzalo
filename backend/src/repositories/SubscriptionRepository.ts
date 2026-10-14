import { Books } from "../models/book.models.js";
import { Suscription } from "../models/suscription.models.js";
import { User } from "../models/user.models.js";
import type {
  ISubscriptionRepository,
  Subscriber,
} from "./interfaces/ISubscriptionRepository.js";

export class SubscriptionRepository implements ISubscriptionRepository {
  findByUserAndBook(
    userId: number,
    bookId: number,
  ): Promise<Suscription | null> {
    return Suscription.findOne({ where: { userId, bookId } });
  }

  create(userId: number, bookId: number): Promise<Suscription> {
    return Suscription.create({ userId, bookId });
  }

  delete(userId: number, bookId: number): Promise<number> {
    return Suscription.destroy({ where: { userId, bookId } });
  }

  findByUser(userId: number): Promise<Suscription[]> {
    return Suscription.findAll({
      where: { userId },
      include: [{ model: Books, as: "book" }],
      order: [["id", "ASC"]],
    });
  }

  async findSubscribers(bookId: number): Promise<Subscriber[]> {
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
