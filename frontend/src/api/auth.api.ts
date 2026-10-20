import { sendJson } from "./client";
import type { AuthResponse } from "../types";

export function login(email: string, password: string): Promise<AuthResponse> {
  return sendJson("/auth/login", "POST", { email, password });
}

export function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  return sendJson("/auth/register", "POST", { name, email, password });
}
