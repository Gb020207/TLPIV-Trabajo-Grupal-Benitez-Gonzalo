export class BookServiceError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = "BookServiceError";
    }
}
const validStatuses = [
    "DISPONIBLE",
    "PRESTADO",
    "EN_REPARACION",
];
export class BookService {
    bookRepository;
    eventPublisher;
    constructor(bookRepository, eventPublisher) {
        this.bookRepository = bookRepository;
        this.eventPublisher = eventPublisher;
    }
    listBooks() {
        return this.bookRepository.findAll();
    }
    async getBook(id) {
        const book = await this.bookRepository.findById(id);
        if (!book) {
            throw new BookServiceError("Libro no encontrado", 404);
        }
        return book;
    }
    async createBook(data) {
        const title = data.title.trim();
        const description = data.description.trim();
        if (!title || title.length > 200 || !description) {
            throw new BookServiceError("El título (hasta 200 caracteres) y la descripción son obligatorios", 400);
        }
        return this.bookRepository.create({ title, description });
    }
    async updateBook(id, data) {
        const update = {};
        if (data.title !== undefined) {
            const title = data.title.trim();
            if (!title || title.length > 200) {
                throw new BookServiceError("El título no es válido", 400);
            }
            update.title = title;
        }
        if (data.description !== undefined) {
            const description = data.description.trim();
            if (!description) {
                throw new BookServiceError("La descripción no es válida", 400);
            }
            update.description = description;
        }
        if (Object.keys(update).length === 0) {
            throw new BookServiceError("Debe indicar el título o la descripción para actualizar", 400);
        }
        const book = await this.bookRepository.update(id, update);
        if (!book) {
            throw new BookServiceError("Libro no encontrado", 404);
        }
        return book;
    }
    async changeBookStatus(id, status) {
        if (!validStatuses.includes(status)) {
            throw new BookServiceError("El estado del libro no es válido", 400);
        }
        const result = await this.bookRepository.changeStatus(id, status);
        if (!result) {
            throw new BookServiceError("Libro no encontrado", 404);
        }
        const { book, previousStatus } = result;
        if (previousStatus !== status) {
            await this.eventPublisher.notify({
                bookId: book.id,
                bookTitle: book.title,
                previousStatus,
                newStatus: status,
            });
        }
        return book;
    }
    async deleteBook(id) {
        const deleted = await this.bookRepository.delete(id);
        if (!deleted) {
            throw new BookServiceError("Libro no encontrado", 404);
        }
    }
}
//# sourceMappingURL=BookService.js.map