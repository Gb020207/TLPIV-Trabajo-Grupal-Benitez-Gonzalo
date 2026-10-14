import type { IObserver } from "./IObserver.js";
import type { ISubject } from "./ISubject.js";
import type { BookStatusChangedEvent } from "./book-status-event.js";

export class EventPublisher implements ISubject {
  private readonly observers = new Set<IObserver>();

  attach(observer: IObserver): void {
    this.observers.add(observer);
  }

  detach(observer: IObserver): void {
    this.observers.delete(observer);
  }

  async notify(event: BookStatusChangedEvent): Promise<void> {
    for (const observer of this.observers) {
      await observer.update(event);
    }
  }
}
