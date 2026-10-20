import { User } from "../models/user.models.js";
import type { CreateUserData, IUserRepository } from "./interfaces/IUserRepository.js";
export declare class UserRepository implements IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    create(data: CreateUserData): Promise<User>;
    listAllWithRoles(): Promise<User[]>;
    updateRole(userId: number, roleId: number): Promise<User | null>;
}
//# sourceMappingURL=UserRepository.d.ts.map