import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AuthTokenPayload {
  userId: number;
  roleId: number;
  permissions: string[];
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthTokenPayload;
    }
  }
}

function isAuthTokenPayload(value: unknown): value is AuthTokenPayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return (
    Number.isSafeInteger(payload.userId) &&
    Number.isSafeInteger(payload.roleId) &&
    Array.isArray(payload.permissions) &&
    payload.permissions.every((permission) => typeof permission === "string")
  );
}

export function authenticate(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authorization = request.header("authorization");
  const [scheme, token, ...extraParts] = authorization?.split(" ") ?? [];
  if (scheme !== "Bearer" || !token || extraParts.length > 0) {
    response.status(401).json({ message: "Se requiere un token Bearer" });
    return;
  }

  try {
    const decoded: unknown = jwt.verify(token, env.jwtSecret);
    if (!isAuthTokenPayload(decoded)) {
      response.status(401).json({ message: "Token inválido" });
      return;
    }

    request.auth = decoded;
    next();
  } catch {
    response.status(401).json({ message: "Token inválido o vencido" });
  }
}
