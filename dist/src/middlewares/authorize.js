export function authorize(permission) {
    return (request, response, next) => {
        if (!request.auth) {
            response.status(401).json({ message: "Autenticación requerida" });
            return;
        }
        if (!request.auth.permissions.includes(permission)) {
            response.status(403).json({ message: "Permiso insuficiente" });
            return;
        }
        next();
    };
}
//# sourceMappingURL=authorize.js.map