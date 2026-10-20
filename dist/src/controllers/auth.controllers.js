import { AuthService } from "../services/AuthService.js";
import { ServiceError } from "../services/ServiceError.js";
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}
function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
class AuthControllers {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(request, response) {
        if (!isRecord(request.body)) {
            response.status(400).json({ message: "El cuerpo de la solicitud no es válido" });
            return;
        }
        const { name, email, password } = request.body;
        if (!isNonEmptyString(name) || name.trim().length > 50) {
            response.status(400).json({
                message: "El nombre es obligatorio y debe tener hasta 50 caracteres",
            });
            return;
        }
        if (!isNonEmptyString(email) || !isValidEmail(email.trim())) {
            response.status(400).json({ message: "El email no es válido" });
            return;
        }
        if (!isNonEmptyString(password) || password.length < 8) {
            response.status(400).json({
                message: "La contraseña debe tener al menos 8 caracteres",
            });
            return;
        }
        try {
            response.status(201).json(await this.authService.register(name, email, password));
        }
        catch (error) {
            this.handleError(error, response, "Failed to register user:");
        }
    }
    async login(request, response) {
        if (!isRecord(request.body)) {
            response.status(400).json({ message: "El cuerpo de la solicitud no es válido" });
            return;
        }
        const { email, password } = request.body;
        if (!isNonEmptyString(email) ||
            !isValidEmail(email.trim()) ||
            !isNonEmptyString(password)) {
            response.status(400).json({
                message: "Debe indicar un email válido y una contraseña",
            });
            return;
        }
        try {
            response.status(200).json(await this.authService.login(email, password));
        }
        catch (error) {
            this.handleError(error, response, "Failed to log in user:");
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
export default AuthControllers;
//# sourceMappingURL=auth.controllers.js.map