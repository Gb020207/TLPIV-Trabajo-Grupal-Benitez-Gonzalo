import type { Suscription } from "../../models/suscription.models.js";

export interface ISubscriptionRepository {
  find(userId: number, bookId: number): Promise<Suscription | null>;
  findByBookId(bookId: number): Promise<Suscription[]>;
  create(userId: number, bookId: number): Promise<Suscription>;
  delete(userId: number, bookId: number): Promise<number>;
}
