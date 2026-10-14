import type { Books, BookStatus } from "../../models/book.models.js";

export interface CreateBookData {
  title: string;
  description: string;
}

export interface UpdateBookData {
  title?: string;
  description?: string;
}

export interface IBookRepository {
  findAll(): Promise<Books[]>;
  findById(id: number): Promise<Books | null>;
  create(data: CreateBookData): Promise<Books>;
  update(id: number, data: UpdateBookData): Promise<Books | null>;
  changeStatus(
    id: number,
    status: BookStatus,
  ): Promise<{ book: Books; previousStatus: BookStatus } | null>;
  delete(id: number): Promise<boolean>;
}
