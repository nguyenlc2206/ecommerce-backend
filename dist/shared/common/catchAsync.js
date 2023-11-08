"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @todo: define try catch async */
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.default = catchAsync;
