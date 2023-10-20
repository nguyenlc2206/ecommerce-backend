import { Response } from 'express';
import Container from 'typedi';

import { AccountRequest, ControllerError } from '@ecommerce-backend/src/shared/types';
import { TokenRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/token.impl';

const tokenRepo = Container.get(TokenRepositoryImpl);

/**  send response on env development */
export const sendErrorDev = (err: ControllerError, req: AccountRequest, res: Response) => {
    if (err.statusCode === 402) tokenRepo.delete(req?.accessToken);

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

/**  send response on env productions */
export const sendErrorProd = (err: ControllerError, req: AccountRequest, res: Response) => {
    if (err.statusCode === 402) tokenRepo.delete(req?.accessToken);

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
    } else {
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
