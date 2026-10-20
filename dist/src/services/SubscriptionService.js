import { ServiceError } from "./ServiceError.js";
export class SubscriptionService {
    subscriptionRepository;
    bookRepository;
    constructor(subscriptionRepository, bookRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.bookRepository = bookRepository;
    }
    async subscribe(userId, bookId) {
        const book = await this.bookRepository.findById(bookId);
        if (!book) {
            throw new ServiceError("Libro no encontrado", 404);
        }
        if (await this.subscriptionRepository.findByUserAndBook(userId, bookId)) {
            throw new ServiceError("Ya estás suscripto a este libro", 409);
        }
        return this.subscriptionRepository.create(userId, bookId);
    }
    async unsubscribe(userId, bookId) {
        const deletedCount = await this.subscriptionRepository.delete(userId, bookId);
        if (deletedCount === 0) {
            throw new ServiceError("No existe esa suscripción", 404);
        }
    }
    listMine(userId) {
        return this.subscriptionRepository.findByUser(userId);
    }
}
//# sourceMappingURL=SubscriptionService.js.map