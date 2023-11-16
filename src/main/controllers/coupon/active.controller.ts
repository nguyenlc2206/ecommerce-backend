// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { ActiveCouponService, ActiveCouponServiceImpl } from '@ecommerce-backend/src/domain/services/coupon/active';

// ==============================||  ACTIVE COUPNON CONTROLLER ||============================== //

@Service()
export class ActiveCouponController {
    /** init services */
    protected activeCouponService: ActiveCouponService<AccountRequest>;

    // * constructor
    constructor() {
        this.activeCouponService = Container.get(ActiveCouponServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        /** execute service */
        const result = await this.activeCouponService.execute(req);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Active coupon success',
            DT: {}
        });
    });
}
