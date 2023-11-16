// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { ActiveProductService, ActiveProductServiceImpl } from '@ecommerce-backend/src/domain/services/product/active';

// ==============================||  ACTIVE PRODUCT CONTROLLER ||============================== //

@Service()
export class ActiveProductController {
    /** init services */
    protected activeProductService: ActiveProductService<AccountRequest>;

    // * constructor
    constructor() {
        this.activeProductService = Container.get(ActiveProductServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        /** execute service */
        const result = await this.activeProductService.execute(req);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Active product success',
            DT: {}
        });
    });
}
