import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export function PermissionRoute({
  permission,
  children,
}: {
  permission: string;
  children: ReactNode;
}) {
  const { user } = useAuth();
  return user?.permissions.includes(permission) ? (
    children
  ) : (
    <Navigate to="/books" replace />
  );
}
