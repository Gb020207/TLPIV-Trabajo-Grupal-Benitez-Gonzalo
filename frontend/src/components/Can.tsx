import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

export function Can({
  permission,
  children,
}: {
  permission: string;
  children: ReactNode;
}) {
  const { user } = useAuth();
  return user?.permissions.includes(permission) ? children : null;
}
