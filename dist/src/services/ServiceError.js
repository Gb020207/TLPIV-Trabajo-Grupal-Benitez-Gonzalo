export class ServiceError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = "ServiceError";
    }
}
//# sourceMappingURL=ServiceError.js.map