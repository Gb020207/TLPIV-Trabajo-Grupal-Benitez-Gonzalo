import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

export default function Can({
  permission,
  children,
}: {
  permission: string;
  children: ReactNode;
}) {
  const { can } = useAuth();
  return can(permission) ? <>{children}</> : null;
}
