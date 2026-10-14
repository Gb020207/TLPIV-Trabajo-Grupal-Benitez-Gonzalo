import type { Role } from "../models/roles.models.js";
import type { User } from "../models/user.models.js";
import type { IRoleRepository } from "../repositories/interfaces/IRoleRepository.js";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository.js";
import { ServiceError } from "./ServiceError.js";

export interface UserWithRole {
  id: number;
  name: string;
  email: string;
  roleId: number;
  role: string;
}

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
  ) {}

  async listUsers(): Promise<User[]> {
    return this.userRepository.listAllWithRoles();
  }

  async assignRole(userId: number, roleId: number): Promise<UserWithRole> {
    const [user, role] = await Promise.all([
      this.userRepository.findById(userId),
      this.roleRepository.findById(roleId),
    ]);
    if (!user) {
      throw new ServiceError("Usuario no encontrado", 404);
    }
    if (!role) {
      throw new ServiceError("Rol no encontrado", 404);
    }

    const updatedUser = await this.userRepository.updateRole(userId, roleId);
    if (!updatedUser) {
      throw new ServiceError("Usuario no encontrado", 404);
    }
    return this.toUserWithRole(updatedUser, role);
  }

  private toUserWithRole(user: User, role: Role): UserWithRole {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      role: role.name,
    };
  }
}
