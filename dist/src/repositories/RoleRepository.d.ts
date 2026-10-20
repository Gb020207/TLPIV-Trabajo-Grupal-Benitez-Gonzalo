import { Role } from "../models/roles.models.js";
import type { IRoleRepository } from "./interfaces/IRoleRepository.js";
export declare class RoleRepository implements IRoleRepository {
    findByName(name: string): Promise<Role | null>;
    findById(id: number): Promise<Role | null>;
    getPermissions(roleId: number): Promise<string[]>;
}
//# sourceMappingURL=RoleRepository.d.ts.map