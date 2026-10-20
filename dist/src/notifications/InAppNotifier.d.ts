import type { INotifier, NotificationMessage } from "./INotifier.js";
import type { INotificationRepository } from "../repositories/interfaces/INotificationRepository.js";
export declare class InAppNotifier implements INotifier {
    private readonly notificationRepository;
    constructor(notificationRepository: INotificationRepository);
    send(notification: NotificationMessage): Promise<void>;
}
//# sourceMappingURL=InAppNotifier.d.ts.map