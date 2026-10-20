import { Router } from "express";
export function createAuthRoutes(authControllers) {
    const authRoutes = Router();
    authRoutes.post("/register", (request, response) => authControllers.register(request, response));
    authRoutes.post("/login", (request, response) => authControllers.login(request, response));
    return authRoutes;
}
//# sourceMappingURL=auth.routes.js.map