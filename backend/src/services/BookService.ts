import type { BookStatus, Books } from "../models/book.models.js";
import type { EventPublisher } from "../observer/EventPublisher.js";
import type { BookInput, IBookRepository } from "../repositories/interfaces/IBookRepository.js";

export class BookService {
  constructor(
    private readonly books: IBookRepository,
    private readonly events: EventPublisher,
  ) {}

  list(): Promise<Books[]> {
    return this.books.findAll();
  }

  findById(id: number): Promise<Books | null> {
    return this.books.findById(id);
  }

  create(input: BookInput): Promise<Books> {
    return this.books.create(input);
  }

  update(book: Books, values: Partial<BookInput>): Promise<Books> {
    return this.books.update(book, values);
  }

  async changeStatus(book: Books, status: BookStatus): Promise<Books> {
    const previousStatus = book.status;
    if (previousStatus === status) {
      return book;
    }

    await this.books.update(book, { status });
    await this.events.notify({
      bookId: book.id,
      bookTitle: book.title,
      previousStatus,
      status,
    });
    return book;
  }

  delete(book: Books): Promise<void> {
    return this.books.delete(book);
  }
}
