import { Role } from "../models/roles.models.js";
import { User } from "../models/user.models.js";
import type {
  CreateUserData,
  IUserRepository,
} from "./interfaces/IUserRepository.js";

export class UserRepository implements IUserRepository {
  findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  findById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  create(data: CreateUserData): Promise<User> {
    return User.create(data);
  }

  listAllWithRoles(): Promise<User[]> {
    return User.findAll({
      attributes: ["id", "name", "email", "roleId", "createdAt", "updatedAt"],
      include: [{ model: Role, as: "role", attributes: ["name"] }],
      order: [["id", "ASC"]],
    });
  }

  async updateRole(userId: number, roleId: number): Promise<User | null> {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }

    await user.update({ roleId });
    return user;
  }
}
