import type { AdminUser, AuthResult } from "../types";
import { apiFetch } from "./client";

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthResult>("/auth/login", { method: "POST", body: { email, password } }),
  register: (name: string, email: string, password: string) =>
    apiFetch<AuthResult>("/auth/register", {
      method: "POST",
      body: { name, email, password },
    }),
};

export const usersApi = {
  list: () => apiFetch<AdminUser[]>("/users"),
  assignRole: (id: number, roleId: number) =>
    apiFetch<AdminUser>(`/users/${id}/role`, { method: "PATCH", body: { roleId } }),
};
