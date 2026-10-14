import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UniqueConstraintError } from "sequelize";
import { env } from "../config/env.js";
import { Permission } from "../models/permission.js";
import { RolePermission } from "../models/role.models.js";
import { Role } from "../models/roles.models.js";
import { User } from "../models/user.models.js";

interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function getRolePermissions(roleId: number): Promise<string[]> {
  const rolePermissions = await RolePermission.findAll({
    where: { roleId },
    attributes: ["permissionId"],
  });
  const permissions = await Permission.findAll({
    where: { id: rolePermissions.map(({ permissionId }) => permissionId) },
    attributes: ["name"],
  });
  return permissions.map(({ name }) => name);
}

function createToken(user: User, role: Role, permissions: string[]): string {
  return jwt.sign(
    { userId: user.id, roleId: role.id, permissions },
    env.jwtSecret,
    { expiresIn: "1h" },
  );
}

function toPublicUser(
  user: User,
  role: Role,
  permissions: string[],
): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: role.name,
    permissions,
  };
}

class AuthControllers {
  async register(
    request: Request,
    response: Response,
  ): Promise<void> {
    if (!isRecord(request.body)) {
      response.status(400).json({ message: "El cuerpo de la solicitud no es válido" });
      return;
    }
    const { name, email, password } = request.body;
    if (!isNonEmptyString(name) || name.trim().length > 50) {
      response.status(400).json({
        message: "El nombre es obligatorio y debe tener hasta 50 caracteres",
      });
      return;
    }
    if (!isNonEmptyString(email) || !isValidEmail(email.trim())) {
      response.status(400).json({ message: "El email no es válido" });
      return;
    }
    if (!isNonEmptyString(password) || password.length < 8) {
      response.status(400).json({
        message: "La contraseña es obligatoria y debe tener al menos 8 caracteres",
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    try {
      const existingUser = await User.findOne({
        where: { email: normalizedEmail },
      });
      if (existingUser) {
        response.status(409).json({ message: "El email ya está registrado" });
        return;
      }

      const role = await Role.findOne({ where: { name: "usuario" } });
      if (!role) {
        console.error('Registration failed: seed role "usuario" is missing.');
        response.status(500).json({
          message: "No está configurado el rol predeterminado",
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        roleId: role.id,
      });
      const permissions = await getRolePermissions(role.id);
      const token = createToken(user, role, permissions);

      response.status(201).json({
        token,
        user: toPublicUser(user, role, permissions),
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        response.status(409).json({ message: "El email ya está registrado" });
        return;
      }
      console.error("Failed to register user:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async login(
    request: Request,
    response: Response,
  ): Promise<void> {
    if (!isRecord(request.body)) {
      response.status(400).json({ message: "El cuerpo de la solicitud no es válido" });
      return;
    }
    const { email, password } = request.body;
    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      response.status(400).json({
        message: "El email y la contraseña son obligatorios",
      });
      return;
    }

    try {
      const user = await User.findOne({
        where: { email: email.trim().toLowerCase() },
      });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        response.status(401).json({ message: "Credenciales inválidas" });
        return;
      }

      const role = await Role.findByPk(user.roleId);
      if (!role) {
        console.error(`Login failed: role ${user.roleId} is missing.`);
        response.status(500).json({
          message: "El rol del usuario no está configurado",
        });
        return;
      }

      const permissions = await getRolePermissions(role.id);
      const token = createToken(user, role, permissions);
      response.status(200).json({
        token,
        user: toPublicUser(user, role, permissions),
      });
    } catch (error) {
      console.error("Failed to log in user:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

export default AuthControllers;
