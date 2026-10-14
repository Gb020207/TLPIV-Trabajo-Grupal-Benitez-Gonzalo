import type { Request, Response } from "express";
import { Role } from "../models/roles.models.js";
import { User } from "../models/user.models.js";

class AdminUserControllers {
  async listUsers(_request: Request, response: Response): Promise<void> {
    try {
      const users = await User.findAll({
        attributes: ["id", "name", "email", "roleId", "createdAt", "updatedAt"],
        include: [{ model: Role, as: "role", attributes: ["name"] }],
        order: [["id", "ASC"]],
      });
      response.status(200).json(users);
    } catch (error) {
      console.error("Failed to list users:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async assignRole(request: Request, response: Response): Promise<void> {
    const userId = Number(request.params.id);
    if (!Number.isSafeInteger(userId) || userId < 1) {
      response.status(400).json({ message: "El ID del usuario no es válido" });
      return;
    }

    const body: unknown = request.body;
    if (typeof body !== "object" || body === null || !("roleId" in body)) {
      response.status(400).json({ message: "Debe indicar el ID del rol" });
      return;
    }
    const roleId = body.roleId;
    if (typeof roleId !== "number" || !Number.isSafeInteger(roleId) || roleId < 1) {
      response.status(400).json({ message: "El ID del rol no es válido" });
      return;
    }

    try {
      const [user, role] = await Promise.all([
        User.findByPk(userId),
        Role.findByPk(roleId),
      ]);
      if (!user) {
        response.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      if (!role) {
        response.status(404).json({ message: "Rol no encontrado" });
        return;
      }

      await user.update({ roleId: role.id });
      response.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        role: role.name,
      });
    } catch (error) {
      console.error("Failed to assign user role:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

export default AdminUserControllers;
