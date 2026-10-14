import type { IObserver, BookStatusChangedEvent } from "./IObserver.js";

export interface ISubject {
    attach(observer: IObserver): void;
    detach(observer: IObserver): void;
    notify(event: BookStatusChangedEvent): Promise<void>;
}
