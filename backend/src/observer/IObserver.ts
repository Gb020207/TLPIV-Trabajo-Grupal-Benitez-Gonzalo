import type { BookStatusChangedEvent } from "./book-status-event.js";

export interface IObserver {
  update(event: BookStatusChangedEvent): Promise<void>;
}
