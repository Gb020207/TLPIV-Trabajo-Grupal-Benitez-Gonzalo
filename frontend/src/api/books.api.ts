import { getJson, send, sendJson } from "./client";
import type { Book, BookStatus } from "../types";

export interface BookInput {
  title: string;
  description: string;
}

export function listBooks(): Promise<Book[]> {
  return getJson("/books");
}

export function getBook(id: number): Promise<Book> {
  return getJson(`/books/${id}`);
}

export function createBook(input: BookInput): Promise<Book> {
  return sendJson("/books", "POST", input);
}

export function updateBook(id: number, input: BookInput): Promise<Book> {
  return sendJson(`/books/${id}`, "PATCH", input);
}

export function changeBookStatus(id: number, status: BookStatus): Promise<Book> {
  return sendJson(`/books/${id}/status`, "PATCH", { status });
}

export function deleteBook(id: number): Promise<void> {
  return send(`/books/${id}`, "DELETE");
}
