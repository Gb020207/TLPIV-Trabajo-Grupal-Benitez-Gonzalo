import { Router } from "express";
import type AuthControllers from "../controllers/auth.controllers.js";

export function createAuthRoutes(authControllers: AuthControllers): Router {
  const authRoutes = Router();

  authRoutes.post("/register", (request, response) =>
    authControllers.register(request, response),
  );
  authRoutes.post("/login", (request, response) =>
    authControllers.login(request, response),
  );

  return authRoutes;
}
