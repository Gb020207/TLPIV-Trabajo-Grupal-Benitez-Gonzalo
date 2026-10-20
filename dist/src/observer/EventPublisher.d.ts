import type { IObserver } from "./IObserver.js";
import type { ISubject } from "./ISubject.js";
import type { BookStatusChangedEvent } from "./book-status-event.js";
export declare class EventPublisher implements ISubject {
    private readonly observers;
    attach(observer: IObserver): void;
    detach(observer: IObserver): void;
    notify(event: BookStatusChangedEvent): Promise<void>;
}
//# sourceMappingURL=EventPublisher.d.ts.map