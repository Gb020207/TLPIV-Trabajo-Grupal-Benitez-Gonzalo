import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UniqueConstraintError } from "sequelize";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository.js";
import type { IRoleRepository } from "../repositories/interfaces/IRoleRepository.js";

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface AuthResult {
  token: string;
  user: AuthenticatedUser;
}

export class AuthServiceError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export class AuthService {
  constructor(
    private readonly users: IUserRepository,
    private readonly roles: IRoleRepository,
    private readonly jwtSecret: string,
  ) {}

  async register(name: string, email: string, password: string): Promise<AuthResult> {
    const normalizedEmail = email.trim().toLowerCase();
    if (await this.users.findByEmail(normalizedEmail)) {
      throw new AuthServiceError("El email ya está registrado", 409);
    }

    const role = await this.roles.findByName("usuario");
    if (!role) {
      throw new AuthServiceError("No está configurado el rol predeterminado", 500);
    }

    try {
      const user = await this.users.create({
        name: name.trim(),
        email: normalizedEmail,
        password: await bcrypt.hash(password, 10),
        roleId: role.id,
      });
      return this.createAuthResult(
        user,
        role.id,
        role.name,
        await this.roles.permissionNames(role.id),
      );
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new AuthServiceError("El email ya está registrado", 409);
      }
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.users.findByEmail(email.trim().toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AuthServiceError("Credenciales inválidas", 401);
    }

    const role = await this.roles.findById(user.roleId);
    if (!role) {
      throw new AuthServiceError("El rol del usuario no está configurado", 500);
    }

    return this.createAuthResult(
      user,
      role.id,
      role.name,
      await this.roles.permissionNames(role.id),
    );
  }

  private createAuthResult(
    user: { id: number; name: string; email: string },
    roleId: number,
    role: string,
    permissions: string[],
  ): AuthResult {
    const token = jwt.sign(
      { userId: user.id, roleId, permissions },
      this.jwtSecret,
      { expiresIn: "1h" },
    );
    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role, permissions },
    };
  }
}
