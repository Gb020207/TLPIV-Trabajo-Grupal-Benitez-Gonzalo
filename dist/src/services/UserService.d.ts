import type { User } from "../models/user.models.js";
import type { IRoleRepository } from "../repositories/interfaces/IRoleRepository.js";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository.js";
export interface UserWithRole {
    id: number;
    name: string;
    email: string;
    roleId: number;
    role: string;
}
export declare class UserService {
    private readonly userRepository;
    private readonly roleRepository;
    constructor(userRepository: IUserRepository, roleRepository: IRoleRepository);
    listUsers(): Promise<User[]>;
    assignRole(userId: number, roleId: number): Promise<UserWithRole>;
    private toUserWithRole;
}
//# sourceMappingURL=UserService.d.ts.map