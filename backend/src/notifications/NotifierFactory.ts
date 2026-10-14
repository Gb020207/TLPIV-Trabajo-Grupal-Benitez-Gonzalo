import type { INotifier } from "./INotifier.js";
import { InAppNotifier } from "./InAppNotifier.js";
import { ConsoleNotifierAdapter } from "./ConsoleNotifierAdapter.js";
import type { INotificationRepository } from "../repositories/interfaces/INotificationRepository.js";

export type NotifierChannel = "inapp" | "console";

export class NotifierFactory {
  constructor(
    private readonly notificationRepository: INotificationRepository,
  ) {}

  create(channel: NotifierChannel): INotifier {
    switch (channel) {
      case "inapp":
        return new InAppNotifier(this.notificationRepository);
      case "console":
        return new ConsoleNotifierAdapter();
    }
  }
}
