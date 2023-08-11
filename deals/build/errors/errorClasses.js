// export class BadRequestError extends Error {
//   statusCode: number;
//   constructor(message: string) {
//     super(message);
//     this.statusCode = 400;
//     this.name = "BadRequestError";
//   }
// }
export class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400; // это свойство используется в обработчике ошибок
        this.name = "BadRequestError";
    }
}
export class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 409;
        this.name = "ConflictError";
    }
}
export class ResourceNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
        this.name = "ResourceNotFoundError";
    }
}
export class AuthorizationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 401;
        this.name = "AuthorizationError";
    }
}
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 403;
        this.name = "ValidationError";
    }
}
export class ServerError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 500;
        this.name = "ServerError";
    }
}
//# sourceMappingURL=errorClasses.js.map