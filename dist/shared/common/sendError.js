"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorProd = exports.sendErrorDev = void 0;
const typedi_1 = __importDefault(require("typedi"));
const token_impl_1 = require("../../infrastructure/repositories/token.impl");
const tokenRepo = typedi_1.default.get(token_impl_1.TokenRepositoryImpl);
/**  send response on env development */
const sendErrorDev = (err, req, res) => {
    if (err.statusCode === 402)
        tokenRepo.delete(req?.accessToken);
    // console.log(">>>Check error:", err);
    res.status(err.statusCode).json({
        status: err.status,
        EC: err.statusCode,
        EM: err.message,
        MS: '',
        DT: {},
        stack: err.stack
    });
};
exports.sendErrorDev = sendErrorDev;
/**  send response on env productions */
const sendErrorProd = (err, req, res) => {
    if (err.statusCode === 402)
        tokenRepo.delete(req?.accessToken);
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            EC: err.statusCode,
            EM: err.message,
            MS: '',
            DT: {}
        });
        // Programing or other unknown error: don't leak error details
    }
    else {
        // 1) Log error
        console.error('ERROR 💥', err);
        // 2) Send generic message
        res.status(err.statusCode || 500).json({
            status: err.status,
            EC: err.statusCode || 500,
            EM: err.message,
            MS: '',
            DT: {}
        });
    }
};
exports.sendErrorProd = sendErrorProd;
