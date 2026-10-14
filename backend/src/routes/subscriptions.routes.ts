import { Router } from "express";
import type SubscriptionControllers from "../controllers/subscription.controllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

export function createSubscriptionsRoutes(
  subscriptionsController: SubscriptionControllers,
): Router {
  const subscriptionsRoutes = Router();

  subscriptionsRoutes.use(authenticate);
  subscriptionsRoutes.get(
    "/",
    authorize("subscription:create"),
    (request, response) => subscriptionsController.listMine(request, response),
  );
  subscriptionsRoutes.post(
    "/:bookId",
    authorize("subscription:create"),
    (request, response) => subscriptionsController.subscribe(request, response),
  );
  subscriptionsRoutes.delete(
    "/:bookId",
    authorize("subscription:delete"),
    (request, response) =>
      subscriptionsController.unsubscribe(request, response),
  );

  return subscriptionsRoutes;
}
