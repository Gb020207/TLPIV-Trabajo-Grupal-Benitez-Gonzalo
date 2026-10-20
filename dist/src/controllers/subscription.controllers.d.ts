import type { Request, Response } from "express";
import { SubscriptionService } from "../services/SubscriptionService.js";
declare class SubscriptionControllers {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    subscribe(request: Request, response: Response): Promise<void>;
    unsubscribe(request: Request, response: Response): Promise<void>;
    listMine(request: Request, response: Response): Promise<void>;
    private handleError;
}
export default SubscriptionControllers;
//# sourceMappingURL=subscription.controllers.d.ts.map