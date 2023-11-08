"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendError_1 = require("../../shared/common/sendError");
/** Define Controller error reponse for app */
const ControllerErrorConfig = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    if (error.name === 'JsonWebTokenError') {
        error.message = 'Invalid token. Please login again!';
        error.statusCode = 402;
    }
    if (error.name === 'TokenExpiredError') {
        error.message = 'Your token has expired. Please login again!';
        error.statusCode = 402;
    }
    // * check envirement for response
    if (process.env.NODE_ENV === 'development') {
        (0, sendError_1.sendErrorDev)(error, req, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        (0, sendError_1.sendErrorProd)(error, req, res);
    }
};
exports.default = ControllerErrorConfig;
