import type { Book, BookInput, BookStatus, Subscription } from "../types";
import { apiFetch } from "./client";

export const booksApi = {
  list: () => apiFetch<Book[]>("/books"),
  get: (id: number) => apiFetch<Book>(`/books/${id}`),
  create: (input: BookInput) => apiFetch<Book>("/books", { method: "POST", body: input }),
  update: (id: number, input: Partial<BookInput>) =>
    apiFetch<Book>(`/books/${id}`, { method: "PATCH", body: input }),
  changeStatus: (id: number, status: BookStatus) =>
    apiFetch<Book>(`/books/${id}/status`, { method: "PATCH", body: { status } }),
  remove: (id: number) => apiFetch<void>(`/books/${id}`, { method: "DELETE" }),
};

export const subscriptionsApi = {
  listMine: () => apiFetch<Subscription[]>("/subscriptions"),
  subscribe: (bookId: number) =>
    apiFetch<Subscription>(`/subscriptions/${bookId}`, { method: "POST" }),
  unsubscribe: (bookId: number) =>
    apiFetch<void>(`/subscriptions/${bookId}`, { method: "DELETE" }),
};
