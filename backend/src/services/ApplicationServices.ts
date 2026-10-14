import type { AuthService } from "./AuthService.js";
import type { BookService } from "./BookService.js";
import type { NotificationInboxService } from "./NotificationInboxService.js";
import type { SubscriptionService } from "./SubscriptionService.js";
import type { UserService } from "./UserService.js";

export interface ApplicationServices {
  auth: AuthService;
  books: BookService;
  notifications: NotificationInboxService;
  subscriptions: SubscriptionService;
  users: UserService;
}
