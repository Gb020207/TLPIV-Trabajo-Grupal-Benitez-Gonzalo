import type { Books, BookStatus } from "../models/book.models.js";
import type { ISubject } from "../observer/ISubject.js";
import type { CreateBookData, IBookRepository, UpdateBookData } from "../repositories/interfaces/IBookRepository.js";
export declare class BookServiceError extends Error {
    readonly statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare class BookService {
    private readonly bookRepository;
    private readonly eventPublisher;
    constructor(bookRepository: IBookRepository, eventPublisher: ISubject);
    listBooks(): Promise<Books[]>;
    getBook(id: number): Promise<Books>;
    createBook(data: CreateBookData): Promise<Books>;
    updateBook(id: number, data: UpdateBookData): Promise<Books>;
    changeBookStatus(id: number, status: BookStatus): Promise<Books>;
    deleteBook(id: number): Promise<void>;
}
//# sourceMappingURL=BookService.d.ts.map