import type { RequestHandler } from "express";

export function authorize(permission: string): RequestHandler {
  return (request, response, next) => {
    if (!request.auth) {
      response.status(401).json({ message: "Autenticación requerida" });
      return;
    }

    if (!request.auth.permissions.includes(permission)) {
      response.status(403).json({ message: "Permiso insuficiente" });
      return;
    }

    next();
  };
}
