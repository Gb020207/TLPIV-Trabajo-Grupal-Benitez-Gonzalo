import { Router } from "express";
import AdminUserControllers from "../controllers/admin-user.controllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

const adminUsersRoutes = Router();
const adminUserController = new AdminUserControllers();

adminUsersRoutes.use(authenticate);
adminUsersRoutes.get("/", authorize("user:read"), (request, response) =>
  adminUserController.listUsers(request, response),
);
adminUsersRoutes.patch(
  "/:id/role",
  authorize("user:assign-role"),
  (request, response) => adminUserController.assignRole(request, response),
);

export default adminUsersRoutes;
