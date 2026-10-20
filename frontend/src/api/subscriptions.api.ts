import { getJson, send, sendJson } from "./client";
import type { SubscriptionStatus } from "../types";

export function getSubscriptionStatus(
  bookId: number,
): Promise<SubscriptionStatus> {
  return getJson(`/subscriptions/books/${bookId}`);
}

export function subscribeToBook(bookId: number): Promise<void> {
  return sendJson(`/subscriptions/books/${bookId}`, "POST");
}

export function unsubscribeFromBook(bookId: number): Promise<void> {
  return send(`/subscriptions/books/${bookId}`, "DELETE");
}
