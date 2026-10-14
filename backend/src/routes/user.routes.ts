import { Router } from "express";
import UserControllers from "../controllers/user.controllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import type { UserService } from "../services/UserService.js";

export function createUserRoutes(service: UserService): Router {
  const userRoutes = Router();
  const controllers = new UserControllers(service);

  userRoutes.use(authenticate, authorize("user:read"));
  userRoutes.get("/", (request, response) => controllers.listUsers(request, response));
  userRoutes.patch(
    "/:id/role",
    authorize("user:assign-role"),
    (request, response) => controllers.assignRole(request, response),
  );

  return userRoutes;
}
