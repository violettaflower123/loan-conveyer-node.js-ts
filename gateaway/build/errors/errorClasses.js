"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = exports.ValidationError = exports.AuthorizationError = exports.ResourceNotFoundError = exports.ConflictError = exports.BadRequestError = void 0;
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400; // это свойство используется в обработчике ошибок
        this.name = "BadRequestError";
    }
}
exports.BadRequestError = BadRequestError;
class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 409;
        this.name = "ConflictError";
    }
}
exports.ConflictError = ConflictError;
class ResourceNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
        this.name = "ResourceNotFoundError";
    }
}
exports.ResourceNotFoundError = ResourceNotFoundError;
class AuthorizationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 401;
        this.name = "AuthorizationError";
    }
}
exports.AuthorizationError = AuthorizationError;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 403;
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
class ServerError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 500;
        this.name = "ServerError";
    }
}
exports.ServerError = ServerError;
//# sourceMappingURL=errorClasses.js.map