import { Role } from "../models/roles.models.js";
import { User } from "../models/user.models.js";
import type { IUserRepository, UserInput } from "./interfaces/IUserRepository.js";

export class UserRepository implements IUserRepository {
  findById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  list(): Promise<User[]> {
    return User.findAll({
      attributes: ["id", "name", "email", "roleId", "createdAt", "updatedAt"],
      include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
      order: [["id", "ASC"]],
    });
  }

  create(input: UserInput): Promise<User> {
    return User.create(input);
  }

  updateRole(user: User, roleId: number): Promise<User> {
    return user.update({ roleId });
  }
}
