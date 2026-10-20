export class EventPublisher {
    observers = new Set();
    attach(observer) {
        this.observers.add(observer);
    }
    detach(observer) {
        this.observers.delete(observer);
    }
    async notify(event) {
        for (const observer of this.observers) {
            await observer.update(event);
        }
    }
}
//# sourceMappingURL=EventPublisher.js.map