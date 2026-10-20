import { Role } from "../models/roles.models.js";
import { User } from "../models/user.models.js";
export class UserRepository {
    findByEmail(email) {
        return User.findOne({ where: { email } });
    }
    findById(id) {
        return User.findByPk(id);
    }
    create(data) {
        return User.create(data);
    }
    listAllWithRoles() {
        return User.findAll({
            attributes: ["id", "name", "email", "roleId", "createdAt", "updatedAt"],
            include: [{ model: Role, as: "role", attributes: ["name"] }],
            order: [["id", "ASC"]],
        });
    }
    async updateRole(userId, roleId) {
        const user = await this.findById(userId);
        if (!user) {
            return null;
        }
        await user.update({ roleId });
        return user;
    }
}
//# sourceMappingURL=UserRepository.js.map