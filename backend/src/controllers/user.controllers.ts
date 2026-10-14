import type { Request, Response } from "express";
import type { UserService } from "../services/UserService.js";

function parseId(value: unknown): number | null {
  const id = typeof value === "string" ? Number(value) : value;
  return typeof id === "number" && Number.isSafeInteger(id) && id > 0 ? id : null;
}

class UserControllers {
  constructor(private readonly users: UserService) {}

  async listUsers(_request: Request, response: Response): Promise<void> {
    try {
      response.status(200).json(await this.users.list());
    } catch (error) {
      console.error("Failed to list users:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async assignRole(request: Request, response: Response): Promise<void> {
    const userId = parseId(request.params.id);
    const roleId =
      typeof request.body === "object" && request.body !== null
        ? parseId(request.body.roleId)
        : null;
    if (userId === null || roleId === null) {
      response.status(400).json({ message: "El ID del usuario o del rol no es válido" });
      return;
    }

    try {
      const result = await this.users.assignRole(userId, roleId);
      if (!result) {
        response.status(404).json({ message: "Usuario o rol no encontrado" });
        return;
      }
      response.status(200).json({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: { id: result.role.id, name: result.role.name },
      });
    } catch (error) {
      console.error("Failed to assign user role:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

export default UserControllers;
