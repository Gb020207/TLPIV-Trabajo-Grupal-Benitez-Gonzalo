import type { Suscription } from "../models/suscription.models.js";
import type { IBookRepository } from "../repositories/interfaces/IBookRepository.js";
import type { ISubscriptionRepository } from "../repositories/interfaces/ISubscriptionRepository.js";

export class SubscriptionService {
  constructor(
    private readonly subscriptions: ISubscriptionRepository,
    private readonly books: IBookRepository,
  ) {}

  async subscribe(userId: number, bookId: number): Promise<{ subscription: Suscription; created: boolean } | null> {
    if (!(await this.books.findById(bookId))) {
      return null;
    }
    const existing = await this.subscriptions.find(userId, bookId);
    if (existing) {
      return { subscription: existing, created: false };
    }
    return {
      subscription: await this.subscriptions.create(userId, bookId),
      created: true,
    };
  }

  async isSubscribed(userId: number, bookId: number): Promise<boolean | null> {
    if (!(await this.books.findById(bookId))) {
      return null;
    }
    return (await this.subscriptions.find(userId, bookId)) !== null;
  }

  unsubscribe(userId: number, bookId: number): Promise<number> {
    return this.subscriptions.delete(userId, bookId);
  }
}
