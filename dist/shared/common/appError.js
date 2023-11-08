"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @todo: define app error reponse */
class AppError extends Error {
    statusCode;
    status;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
