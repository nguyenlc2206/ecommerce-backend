"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../../shared/common/appError"));
// ==============================||  MIDDLEWARE ||============================== //
const middlewareRoleRestrictTo = (roles) => {
    return async (req, res, next) => {
        if (req?.account?.role) {
            if (!roles.includes(req?.account?.role)) {
                return next(new appError_1.default('You do not have permission to perform this action!', 403));
            }
        }
        return next();
    };
};
exports.default = middlewareRoleRestrictTo;
