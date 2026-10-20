import type { INotifier } from "./INotifier.js";
import type { INotificationRepository } from "../repositories/interfaces/INotificationRepository.js";
export type NotifierChannel = "inapp" | "console";
export declare class NotifierFactory {
    private readonly notificationRepository;
    constructor(notificationRepository: INotificationRepository);
    create(channel: NotifierChannel): INotifier;
}
//# sourceMappingURL=NotifierFactory.d.ts.map