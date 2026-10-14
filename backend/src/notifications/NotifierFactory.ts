import type { INotifier } from "./INotifier.js";
import { InAppNotifier } from "./InAppNotifier.js";
import { ConsoleNotifierAdapter } from "./ConsoleNotifierAdapter.js";

export type NotifierChannel = "inapp" | "console";

export class NotifierFactory {
  create(channel: NotifierChannel): INotifier {
    switch (channel) {
      case "inapp":
        return new InAppNotifier();
      case "console":
        return new ConsoleNotifierAdapter();
    }
  }
}
