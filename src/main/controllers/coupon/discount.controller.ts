// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { ValidationCreateCoupon } from '@ecommerce-backend/src/main/controllers/validations/coupon/create';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { CreateCouponService, CreateCouponServiceImpl } from '@ecommerce-backend/src/domain/services/coupon/create';
import { DiscountService, DiscountServiceImpl } from '@ecommerce-backend/src/domain/services/coupon/discount';

// ==============================||  DISCOUNT COUPON CONTROLLER ||============================== //

@Service()
export class DiscountController {
    /** init services */
    protected discountService: DiscountService<AccountRequest>;

    /** constructor */
    constructor() {
        this.discountService = Container.get(DiscountServiceImpl);
    }

    /** overding execute function */
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        /** validation */

        /** execute create category */
        const response = await this.discountService.execute(req);
        if (response.isFailure()) return next(response.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Get discount success',
            DT: { data: response.data }
        });
    });
}
