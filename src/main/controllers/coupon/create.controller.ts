// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { ValidationCreateCoupon } from '@ecommerce-backend/src/main/controllers/validations/coupon/create';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { CreateCouponService, CreateCouponServiceImpl } from '@ecommerce-backend/src/domain/services/coupon/create';

// ==============================||  CREATE COUPON CONTROLLER ||============================== //

@Service()
export class CreateCouponController {
    /** init services */
    protected validation = new ValidationCreateCoupon();
    protected createCouponService: CreateCouponService<AccountRequest>;

    /** constructor */
    constructor() {
        this.createCouponService = Container.get(CreateCouponServiceImpl);
    }

    /** overding execute function */
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        /** validation */
        const validation = this.validation.execute(req);
        if (validation) return next(validation);

        /** execute create category */
        const response = await this.createCouponService.execute(req);
        if (response.isFailure()) return next(response.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Insert coupon to database success',
            DT: { data: response.data }
        });
    });
}
