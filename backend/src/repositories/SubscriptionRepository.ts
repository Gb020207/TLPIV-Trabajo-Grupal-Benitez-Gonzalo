import { Suscription } from "../models/suscription.models.js";
import type { ISubscriptionRepository } from "./interfaces/ISubscriptionRepository.js";

export class SubscriptionRepository implements ISubscriptionRepository {
  find(userId: number, bookId: number): Promise<Suscription | null> {
    return Suscription.findOne({ where: { userId, bookId } });
  }

  findByBookId(bookId: number): Promise<Suscription[]> {
    return Suscription.findAll({ where: { bookId }, attributes: ["userId", "bookId"] });
  }

  create(userId: number, bookId: number): Promise<Suscription> {
    return Suscription.create({ userId, bookId });
  }

  delete(userId: number, bookId: number): Promise<number> {
    return Suscription.destroy({ where: { userId, bookId } });
  }
}
