import { ServiceError } from "./ServiceError.js";
export class UserService {
    userRepository;
    roleRepository;
    constructor(userRepository, roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }
    async listUsers() {
        return this.userRepository.listAllWithRoles();
    }
    async assignRole(userId, roleId) {
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
    toUserWithRole(user, role) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            roleId: user.roleId,
            role: role.name,
        };
    }
}
//# sourceMappingURL=UserService.js.map