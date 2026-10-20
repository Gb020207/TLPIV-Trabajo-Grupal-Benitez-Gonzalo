import { Router } from "express";
import SubscriptionControllers from "../controllers/subscription.controllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import type { SubscriptionService } from "../services/SubscriptionService.js";

export function createSubscriptionRoutes(service: SubscriptionService): Router {
  const subscriptionRoutes = Router();
  const controllers = new SubscriptionControllers(service);

  subscriptionRoutes.use(authenticate);
  subscriptionRoutes.get(
    "/books/:bookId",
    authorize("subscription:create"),
    (request, response) => controllers.getStatus(request, response),
  );
  subscriptionRoutes.post(
    "/books/:bookId",
    authorize("subscription:create"),
    (request, response) => controllers.subscribe(request, response),
  );
  subscriptionRoutes.delete(
    "/books/:bookId",
    authorize("subscription:delete"),
    (request, response) => controllers.unsubscribe(request, response),
  );

  return subscriptionRoutes;
}
