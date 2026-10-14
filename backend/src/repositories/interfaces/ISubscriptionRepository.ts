import type { Suscription } from "../../models/suscription.models.js";

export interface Subscriber {
  id: number;
  email: string;
}

export interface ISubscriptionRepository {
  findByUserAndBook(userId: number, bookId: number): Promise<Suscription | null>;
  create(userId: number, bookId: number): Promise<Suscription>;
  delete(userId: number, bookId: number): Promise<number>;
  findByUser(userId: number): Promise<Suscription[]>;
  findSubscribers(bookId: number): Promise<Subscriber[]>;
}
