import { InAppNotifier } from "./InAppNotifier.js";
import { ConsoleNotifierAdapter } from "./ConsoleNotifierAdapter.js";
export class NotifierFactory {
    notificationRepository;
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    create(channel) {
        switch (channel) {
            case "inapp":
                return new InAppNotifier(this.notificationRepository);
            case "console":
                return new ConsoleNotifierAdapter();
        }
    }
}
//# sourceMappingURL=NotifierFactory.js.map