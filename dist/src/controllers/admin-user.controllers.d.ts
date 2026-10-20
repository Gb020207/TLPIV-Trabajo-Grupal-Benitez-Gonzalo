import type { Request, Response } from "express";
import { UserService } from "../services/UserService.js";
declare class AdminUserControllers {
    private readonly userService;
    constructor(userService: UserService);
    listUsers(_request: Request, response: Response): Promise<void>;
    assignRole(request: Request, response: Response): Promise<void>;
    private handleError;
}
export default AdminUserControllers;
//# sourceMappingURL=admin-user.controllers.d.ts.map