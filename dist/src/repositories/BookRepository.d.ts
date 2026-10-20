import { Books, type BookStatus } from "../models/book.models.js";
import type { CreateBookData, IBookRepository, UpdateBookData } from "./interfaces/IBookRepository.js";
export declare class BookRepository implements IBookRepository {
    findAll(): Promise<Books[]>;
    findById(id: number): Promise<Books | null>;
    create(data: CreateBookData): Promise<Books>;
    update(id: number, data: UpdateBookData): Promise<Books | null>;
    changeStatus(id: number, status: BookStatus): Promise<{
        book: Books;
        previousStatus: BookStatus;
    } | null>;
    delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=BookRepository.d.ts.map