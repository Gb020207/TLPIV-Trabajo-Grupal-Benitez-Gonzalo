import type { INotifier } from "./INotifier.js";
import { ConsoleNotifierAdapter } from "./ConsoleNotifierAdapter.js";
import { InAppNotifier } from "./InAppNotifier.js";
import type { INotificationRepository } from "../repositories/interfaces/INotificationRepository.js";

export class NotifierFactory {
    private readonly creators = new Map<string, () => INotifier>();

    constructor(private readonly notifications: INotificationRepository) {}

    register(channel: string, createNotifier: () => INotifier): void {
        this.creators.set(channel, createNotifier);
    }

    create(channel: string): INotifier {
        if (channel === "inapp" && !this.creators.has(channel)) {
            this.register(channel, () => new InAppNotifier(this.notifications));
        }
        if (channel === "console" && !this.creators.has(channel)) {
            this.register(channel, () => new ConsoleNotifierAdapter());
        }

        const createNotifier = this.creators.get(channel);
        if (!createNotifier) {
            throw new Error(`Unsupported notification channel: ${channel}`);
        }
        return createNotifier();
    }
}
