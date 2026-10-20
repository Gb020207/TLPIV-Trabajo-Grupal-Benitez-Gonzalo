import type { IObserver } from "./IObserver.js";
import type { BookStatusChangedEvent } from "./book-status-event.js";
export interface ISubject {
    attach(observer: IObserver): void;
    detach(observer: IObserver): void;
    notify(event: BookStatusChangedEvent): Promise<void>;
}
//# sourceMappingURL=ISubject.d.ts.map