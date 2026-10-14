import type { BookStatus } from "../models/book.models.js";
import { Books } from "../models/book.models.js";
import type { BookInput, IBookRepository } from "./interfaces/IBookRepository.js";

export class BookRepository implements IBookRepository {
  findAll(): Promise<Books[]> {
    return Books.findAll({ order: [["id", "ASC"]] });
  }

  findById(id: number): Promise<Books | null> {
    return Books.findByPk(id);
  }

  create(input: BookInput): Promise<Books> {
    return Books.create(input);
  }

  async update(
    book: Books,
    values: Partial<BookInput> & { status?: BookStatus },
  ): Promise<Books> {
    return book.update(values);
  }

  async delete(book: Books): Promise<void> {
    await book.destroy();
  }
}
