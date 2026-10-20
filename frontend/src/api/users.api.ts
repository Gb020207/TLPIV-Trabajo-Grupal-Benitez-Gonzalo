import { getJson, sendJson } from "./client";
import type { AdminUser, Role } from "../types";

export function listUsers(): Promise<AdminUser[]> {
  return getJson("/users");
}

export function listRoles(): Promise<Role[]> {
  return getJson("/users/roles");
}

export function assignRole(userId: number, roleId: number): Promise<AdminUser> {
  return sendJson(`/users/${userId}/role`, "PATCH", { roleId });
}
