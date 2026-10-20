import type { IRoleRepository } from "../repositories/interfaces/IRoleRepository.js";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository.js";
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
export declare class AuthService {
    private readonly userRepository;
    private readonly roleRepository;
    constructor(userRepository: IUserRepository, roleRepository: IRoleRepository);
    register(name: string, email: string, password: string): Promise<AuthResult>;
    login(email: string, password: string): Promise<AuthResult>;
    private createAuthResult;
}
//# sourceMappingURL=AuthService.d.ts.map