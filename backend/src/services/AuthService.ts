import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UniqueConstraintError } from "sequelize";
import { env } from "../config/env.js";
import type { Role } from "../models/roles.models.js";
import type { User } from "../models/user.models.js";
import type { IRoleRepository } from "../repositories/interfaces/IRoleRepository.js";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository.js";
import { ServiceError } from "./ServiceError.js";

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface AuthResult {
  token: string;
  user: PublicUser;
}

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
  ) {}

  async register(name: string, email: string, password: string): Promise<AuthResult> {
    const normalizedEmail = email.trim().toLowerCase();
    if (await this.userRepository.findByEmail(normalizedEmail)) {
      throw new ServiceError("El email ya está registrado", 409);
    }

    const role = await this.roleRepository.findByName("usuario");
    if (!role) {
      throw new ServiceError("No está configurado el rol predeterminado", 500);
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userRepository.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        roleId: role.id,
      });
      return this.createAuthResult(user, role);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ServiceError("El email ya está registrado", 409);
      }
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(
      email.trim().toLowerCase(),
    );
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ServiceError("Credenciales inválidas", 401);
    }

    const role = await this.roleRepository.findById(user.roleId);
    if (!role) {
      throw new ServiceError("El rol del usuario no está configurado", 500);
    }
    return this.createAuthResult(user, role);
  }

  private async createAuthResult(user: User, role: Role): Promise<AuthResult> {
    const permissions = await this.roleRepository.getPermissions(role.id);
    const token = jwt.sign(
      { userId: user.id, roleId: role.id, permissions },
      env.jwtSecret,
      { expiresIn: "1h" },
    );
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role.name,
        permissions,
      },
    };
  }
}
