import { UserService } from "../services/UserService.js";
import { ServiceError } from "../services/ServiceError.js";
function parsePositiveInteger(value) {
    if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
        return null;
    }
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) ? parsed : null;
}
class AdminUserControllers {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async listUsers(_request, response) {
        try {
            response.status(200).json(await this.userService.listUsers());
        }
        catch (error) {
            this.handleError(error, response, "Failed to list users:");
        }
    }
    async assignRole(request, response) {
        const userId = parsePositiveInteger(request.params.id);
        if (userId === null) {
            response.status(400).json({ message: "El ID del usuario no es válido" });
            return;
        }
        const body = request.body;
        if (typeof body !== "object" ||
            body === null ||
            !("roleId" in body) ||
            typeof body.roleId !== "number" ||
            !Number.isSafeInteger(body.roleId) ||
            body.roleId < 1) {
            response.status(400).json({ message: "El ID del rol no es válido" });
            return;
        }
        try {
            response
                .status(200)
                .json(await this.userService.assignRole(userId, body.roleId));
        }
        catch (error) {
            this.handleError(error, response, "Failed to assign user role:");
        }
    }
    handleError(error, response, context) {
        if (error instanceof ServiceError) {
            response.status(error.statusCode).json({ message: error.message });
            return;
        }
        console.error(context, error);
        response.status(500).json({ message: "Error interno del servidor" });
    }
}
export default AdminUserControllers;
//# sourceMappingURL=admin-user.controllers.js.map