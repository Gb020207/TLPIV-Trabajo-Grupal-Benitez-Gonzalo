import express from "express";
import type AdminUserControllers from "./controllers/admin-user.controllers.js";
import type AuthControllers from "./controllers/auth.controllers.js";
import type NotificationControllers from "./controllers/notification.controllers.js";
import type SubscriptionControllers from "./controllers/subscription.controllers.js";
import type BookControllers from "./controllers/book.controllers.js";
export interface AppControllers {
    auth: AuthControllers;
    books: BookControllers;
    subscriptions: SubscriptionControllers;
    notifications: NotificationControllers;
    adminUsers: AdminUserControllers;
}
export declare function createApp(controllers: AppControllers): express.Express;
//# sourceMappingURL=app.d.ts.map