import type { Request, Response } from "express";
import { BookService } from "../services/BookService.js";
declare class BookControllers {
    private readonly bookService;
    constructor(bookService: BookService);
    listBooks(_request: Request, response: Response): Promise<void>;
    getBook(request: Request, response: Response): Promise<void>;
    createBook(request: Request, response: Response): Promise<void>;
    updateBook(request: Request, response: Response): Promise<void>;
    changeBookStatus(request: Request, response: Response): Promise<void>;
    deleteBook(request: Request, response: Response): Promise<void>;
    private handleError;
}
export default BookControllers;
//# sourceMappingURL=book.controllers.d.ts.map