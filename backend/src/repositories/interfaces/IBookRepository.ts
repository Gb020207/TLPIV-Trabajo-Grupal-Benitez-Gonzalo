import type { BookStatus, Books } from "../../models/book.models.js";

export interface BookInput {
  title: string;
  description: string;
}

export interface IBookRepository {
  findAll(): Promise<Books[]>;
  findById(id: number): Promise<Books | null>;
  create(input: BookInput): Promise<Books>;
  update(book: Books, values: Partial<BookInput> & { status?: BookStatus }): Promise<Books>;
  delete(book: Books): Promise<void>;
}
