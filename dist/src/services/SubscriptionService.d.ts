import type { Suscription } from "../models/suscription.models.js";
import type { IBookRepository } from "../repositories/interfaces/IBookRepository.js";
import type { ISubscriptionRepository } from "../repositories/interfaces/ISubscriptionRepository.js";
export declare class SubscriptionService {
    private readonly subscriptionRepository;
    private readonly bookRepository;
    constructor(subscriptionRepository: ISubscriptionRepository, bookRepository: IBookRepository);
    subscribe(userId: number, bookId: number): Promise<Suscription>;
    unsubscribe(userId: number, bookId: number): Promise<void>;
    listMine(userId: number): Promise<Suscription[]>;
}
//# sourceMappingURL=SubscriptionService.d.ts.map