import { NextFunction, Request, Response } from 'express';

/** @todo: define try catch async */
const catchAsync = (fn: any) => {
    return (req?: Request, res?: Response, next?: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};

export default catchAsync;
