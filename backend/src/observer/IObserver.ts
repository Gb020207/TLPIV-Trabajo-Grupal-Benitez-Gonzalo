export interface BookStatusChangedEvent {
    bookId: number;
    bookTitle: string;
    previousStatus: string;
    status: string;
}

export interface IObserver {
    update(event: BookStatusChangedEvent): Promise<void>;
}
