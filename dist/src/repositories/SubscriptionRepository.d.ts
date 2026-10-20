import { Suscription } from "../models/suscription.models.js";
import type { ISubscriptionRepository, Subscriber } from "./interfaces/ISubscriptionRepository.js";
export declare class SubscriptionRepository implements ISubscriptionRepository {
    findByUserAndBook(userId: number, bookId: number): Promise<Suscription | null>;
    create(userId: number, bookId: number): Promise<Suscription>;
    delete(userId: number, bookId: number): Promise<number>;
    findByUser(userId: number): Promise<Suscription[]>;
    findSubscribers(bookId: number): Promise<Subscriber[]>;
}
//# sourceMappingURL=SubscriptionRepository.d.ts.map