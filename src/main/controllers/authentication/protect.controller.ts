// * import libs
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import {
    ProtectedService,
    ProtectedServiceImpl
} from '@ecommerce-backend/src/domain/services/authentication/protected';

// ==============================||  PROTECTED CONTROLLER CONTROLLER ||============================== //

@Service()
export class ProtectedRoutesController {
    protected protectedService: ProtectedService<AccountRequest>;

    // * constructor
    constructor() {
        this.protectedService = Container.get(ProtectedServiceImpl);
    }

    // * execute method
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        // * execute protect services
        const response = await this.protectedService.execute(req);
        if (response.isFailure()) return next(response.error);

        // * processing response
        req.account = response.data;
        req.userId = response.data?.id;
        next();
    });
}
