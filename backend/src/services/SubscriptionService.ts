import type { Suscription } from "../models/suscription.models.js";
import type { IBookRepository } from "../repositories/interfaces/IBookRepository.js";
import type { ISubscriptionRepository } from "../repositories/interfaces/ISubscriptionRepository.js";
import { ServiceError } from "./ServiceError.js";

export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly bookRepository: IBookRepository,
  ) {}

  async subscribe(userId: number, bookId: number): Promise<Suscription> {
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new ServiceError("Libro no encontrado", 404);
    }
    if (await this.subscriptionRepository.findByUserAndBook(userId, bookId)) {
      throw new ServiceError("Ya estás suscripto a este libro", 409);
    }
    return this.subscriptionRepository.create(userId, bookId);
  }

  async unsubscribe(userId: number, bookId: number): Promise<void> {
    const deletedCount = await this.subscriptionRepository.delete(userId, bookId);
    if (deletedCount === 0) {
      throw new ServiceError("No existe esa suscripción", 404);
    }
  }

  listMine(userId: number): Promise<Suscription[]> {
    return this.subscriptionRepository.findByUser(userId);
  }
}
