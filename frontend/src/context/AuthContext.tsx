import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthResponse, User } from "../types";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  saveSession: (session: AuthResponse) => void;
  logout: () => void;
}

interface StoredSession {
  token: string;
  user: User;
}

const storageKey = "biblioteca.session";
const AuthContext = createContext<AuthContextValue | null>(null);

function isStoredSession(value: unknown): value is StoredSession {
  if (
    typeof value !== "object" ||
    value === null ||
    !("token" in value) ||
    typeof value.token !== "string" ||
    !("user" in value) ||
    typeof value.user !== "object" ||
    value.user === null
  ) {
    return false;
  }
  const user = value.user;
  return (
    "id" in user &&
    typeof user.id === "number" &&
    "name" in user &&
    typeof user.name === "string" &&
    "email" in user &&
    typeof user.email === "string" &&
    "role" in user &&
    typeof user.role === "string" &&
    "permissions" in user &&
    Array.isArray(user.permissions) &&
    user.permissions.every((permission: unknown) => typeof permission === "string")
  );
}

function readSession(): StoredSession | null {
  const stored = localStorage.getItem(storageKey);
  if (!stored) {
    return null;
  }

  try {
    const session: unknown = JSON.parse(stored);
    if (isStoredSession(session)) {
      return session;
    }
  } catch {
    localStorage.removeItem(storageKey);
    localStorage.removeItem("biblioteca.token");
  }
  localStorage.removeItem(storageKey);
  localStorage.removeItem("biblioteca.token");
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(readSession);

  const saveSession = useCallback((next: AuthResponse) => {
    const stored = { token: next.token, user: next.user };
    localStorage.setItem(storageKey, JSON.stringify(stored));
    localStorage.setItem("biblioteca.token", next.token);
    setSession(stored);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem("biblioteca.token");
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      token: session?.token ?? null,
      user: session?.user ?? null,
      saveSession,
      logout,
    }),
    [session, saveSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
