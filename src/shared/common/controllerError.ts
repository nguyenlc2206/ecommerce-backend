// * import lib
import { NextFunction, Request, Response } from 'express';

// * import project
import { AccountRequest, ControllerError } from '@ecommerce-backend/src/shared/types/index';
import { sendErrorDev, sendErrorProd } from '@ecommerce-backend/src/shared/common/sendError';

/** Define Controller error reponse for app */
const ControllerErrorConfig = (error: ControllerError, req: AccountRequest, res: Response, next: NextFunction) => {
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
        sendErrorDev(error, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(error, req, res);
    }
};

export default ControllerErrorConfig;
