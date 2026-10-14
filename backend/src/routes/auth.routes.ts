import { Router } from "express";
import AuthControllers from "../controllers/auth.controllers.js";

const authRoutes = Router();
const authControllers = new AuthControllers();

authRoutes.post("/register", (request, response) =>
  authControllers.register(request, response),
);
authRoutes.post("/login", (request, response) =>
  authControllers.login(request, response),
);

export default authRoutes;
