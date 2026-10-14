import type { User } from "../models/user.models.js";
import type { Role } from "../models/roles.models.js";
import type { IRoleRepository } from "../repositories/interfaces/IRoleRepository.js";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository.js";

export class UserService {
  constructor(
    private readonly users: IUserRepository,
    private readonly roles: IRoleRepository,
  ) {}

  list(): Promise<User[]> {
    return this.users.list();
  }

  async assignRole(
    userId: number,
    roleId: number,
  ): Promise<{ user: User; role: Role } | null> {
    const [user, role] = await Promise.all([
      this.users.findById(userId),
      this.roles.findById(roleId),
    ]);
    if (!user || !role) {
      return null;
    }
    return { user: await this.users.updateRole(user, role.id), role };
  }
}
