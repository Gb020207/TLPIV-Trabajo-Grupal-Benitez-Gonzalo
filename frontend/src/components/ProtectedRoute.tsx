import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

interface Props {
  permission?: string;
  children?: ReactNode;
}

export default function ProtectedRoute({ permission, children }: Props) {
  const { user, can } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (permission && !can(permission)) return <Navigate to="/" replace />;
  return <>{children ?? <Outlet />}</>;
}
