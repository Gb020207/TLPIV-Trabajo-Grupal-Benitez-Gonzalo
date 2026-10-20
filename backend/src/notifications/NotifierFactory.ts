import type { INotifier } from "./INotifier.js";
import { ConsoleNotifierAdapter } from "./ConsoleNotifierAdapter.js";
import { InAppNotifier } from "./InAppNotifier.js";
import type { INotificationRepository } from "../repositories/interfaces/INotificationRepository.js";
import type { Notification } from "../models/notification.models.js";

export class NotifierFactory {
    private readonly creators = new Map<string, () => INotifier>();

    constructor(notifications: INotificationRepository) {
        this.register("inapp", () => new InAppNotifier(notifications));
        this.register("console", () => new ConsoleNotifierAdapter());
    }

    register(channel: string, createNotifier: () => INotifier): void {
        if (!channel.trim()) {
            throw new Error("Notification channel name cannot be empty.");
        }
        this.creators.set(channel, createNotifier);
    }

    create(channel: string): INotifier {
        const createNotifier = this.creators.get(channel);
        if (!createNotifier) {
            throw new Error(`Unsupported notification channel: ${channel}`);
        }
        return createNotifier();
    }

    async sendToAll(notification: Notification): Promise<void> {
        for (const createNotifier of this.creators.values()) {
            await createNotifier().send(notification);
        }
    }
}
