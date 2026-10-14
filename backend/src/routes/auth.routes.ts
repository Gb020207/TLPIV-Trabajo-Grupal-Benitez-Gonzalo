import { Router } from "express";
import AuthControllers from "../controllers/auth.controllers.js";
import type { AuthService } from "../services/AuthService.js";

export function createAuthRoutes(authService: AuthService): Router {
  const authRoutes = Router();
  const authControllers = new AuthControllers(authService);

  authRoutes.post("/register", (request, response) =>
    authControllers.register(request, response),
  );
  authRoutes.post("/login", (request, response) =>
    authControllers.login(request, response),
  );

  return authRoutes;
}
