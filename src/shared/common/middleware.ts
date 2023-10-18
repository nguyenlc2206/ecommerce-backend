import { NextFunction, Response } from 'express';

import { AccountRequest, RolesType } from '@ecommerce-backend/src/shared/types';
import AppError from '@ecommerce-backend/src/shared/common/appError';

// ==============================||  MIDDLEWARE ||============================== //

const middlewareRoleRestrictTo = (roles: RolesType[]) => {
    return async (req: AccountRequest, res: Response, next: NextFunction) => {
        if (req?.account?.role) {
            if (!roles.includes(req?.account?.role)) {
                return next(new AppError('You do not have permission to perform this action!', 403));
            }
        }
        return next();
    };
};

export default middlewareRoleRestrictTo;
