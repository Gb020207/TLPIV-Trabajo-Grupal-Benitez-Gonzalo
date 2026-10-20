import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
export function createAdminUsersRoutes(adminUserController) {
    const adminUsersRoutes = Router();
    adminUsersRoutes.use(authenticate);
    adminUsersRoutes.get("/", authorize("user:read"), (request, response) => adminUserController.listUsers(request, response));
    adminUsersRoutes.patch("/:id/role", authorize("user:assign-role"), (request, response) => adminUserController.assignRole(request, response));
    return adminUsersRoutes;
}
//# sourceMappingURL=admin-users.routes.js.map