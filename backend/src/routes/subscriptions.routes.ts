import { Router } from "express";
import SubscriptionControllers from "../controllers/suscription.models.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

const subscriptionsRoutes = Router();
const subscriptionsController = new SubscriptionControllers();

subscriptionsRoutes.use(authenticate);
subscriptionsRoutes.get("/", authorize("subscription:create"), (request, response) =>
  subscriptionsController.listMySubscriptions(request, response),
);
subscriptionsRoutes.post(
  "/:bookId",
  authorize("subscription:create"),
  (request, response) => subscriptionsController.subscribe(request, response),
);
subscriptionsRoutes.delete(
  "/:bookId",
  authorize("subscription:delete"),
  (request, response) => subscriptionsController.unsubscribe(request, response),
);

export default subscriptionsRoutes;
