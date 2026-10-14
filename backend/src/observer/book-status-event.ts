import type { BookStatus } from "../models/book.models.js";

export interface BookStatusChangedEvent {
  bookId: number;
  bookTitle: string;
  previousStatus: BookStatus;
  newStatus: BookStatus;
}
