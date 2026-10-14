import type { Notification } from "../models/notification.models.js";

export interface INotifier {
    send(notification: Notification): Promise<void>;
}
