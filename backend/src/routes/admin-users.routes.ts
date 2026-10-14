import { Router } from "express";
import type AdminUserControllers from "../controllers/admin-user.controllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

export function createAdminUsersRoutes(
  adminUserController: AdminUserControllers,
): Router {
  const adminUsersRoutes = Router();

  adminUsersRoutes.use(authenticate);
  adminUsersRoutes.get("/", authorize("user:read"), (request, response) =>
    adminUserController.listUsers(request, response),
  );
  adminUsersRoutes.patch(
    "/:id/role",
    authorize("user:assign-role"),
    (request, response) => adminUserController.assignRole(request, response),
  );

  return adminUsersRoutes;
}
