import type { Request, Response } from "express";
import { NotificationService } from "../services/NotificationService.js";
declare class NotificationControllers {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    listMine(request: Request, response: Response): Promise<void>;
    markAsRead(request: Request, response: Response): Promise<void>;
    private handleError;
}
export default NotificationControllers;
//# sourceMappingURL=notification.controllers.d.ts.map