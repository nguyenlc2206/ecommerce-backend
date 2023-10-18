import { Response } from 'express';
import { ControllerError } from '@ecommerce-backend/src/shared/types';

/**  send response on env development */
export const sendErrorDev = (err: ControllerError, res: Response) => {
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
export const sendErrorProd = (err: ControllerError, res: Response) => {
    // console.log(">>>Check error:", err);
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
