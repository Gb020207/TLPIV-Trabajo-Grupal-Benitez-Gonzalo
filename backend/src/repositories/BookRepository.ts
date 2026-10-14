import { Books, type BookStatus } from "../models/book.models.js";
import type {
  CreateBookData,
  IBookRepository,
  UpdateBookData,
} from "./interfaces/IBookRepository.js";

export class BookRepository implements IBookRepository {
  findAll(): Promise<Books[]> {
    return Books.findAll({ order: [["id", "ASC"]] });
  }

  findById(id: number): Promise<Books | null> {
    return Books.findByPk(id);
  }

  create(data: CreateBookData): Promise<Books> {
    return Books.create(data);
  }

  async update(id: number, data: UpdateBookData): Promise<Books | null> {
    const book = await this.findById(id);
    if (!book) {
      return null;
    }

    await book.update(data);
    return book;
  }

  async changeStatus(
    id: number,
    status: BookStatus,
  ): Promise<{ book: Books; previousStatus: BookStatus } | null> {
    const book = await this.findById(id);
    if (!book) {
      return null;
    }

    const previousStatus = book.status;
    await book.update({ status });
    return { book, previousStatus };
  }

  async delete(id: number): Promise<boolean> {
    const book = await this.findById(id);
    if (!book) {
      return false;
    }

    await book.destroy();
    return true;
  }
}
