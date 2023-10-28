// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { DeleteCouponService, DeleteCouponServiceImpl } from '@ecommerce-backend/src/domain/services/coupon/delete';

// ==============================||  DELETE COUPON CONTROLLER ||============================== //
@Service()
export class DeleteCouponController {
    /** init services */
    protected deleteCouponService: DeleteCouponService<AccountRequest>;

    // * constructor
    constructor() {
        this.deleteCouponService = Container.get(DeleteCouponServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        /** execute service */
        const result = await this.deleteCouponService.execute(req);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Delete coupon success',
            DT: { data: {} }
        });
    });
}
