import type { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";
declare class AuthControllers {
    private readonly authService;
    constructor(authService: AuthService);
    register(request: Request, response: Response): Promise<void>;
    login(request: Request, response: Response): Promise<void>;
    private handleError;
}
export default AuthControllers;
//# sourceMappingURL=auth.controllers.d.ts.map