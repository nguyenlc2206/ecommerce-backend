// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { CategoryModel } from '@ecommerce-backend/src/domain/models/Category';
import { GetAllOrderService, GetAllOrderServiceImpl } from '@ecommerce-backend/src/domain/services/order/getAll';
import { GetAllCouponService, GetAllCouponServiceImpl } from '@ecommerce-backend/src/domain/services/coupon/getAll';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';

// ==============================||  GET ALL COUPON CONTROLLER ||============================== //

@Service()
export class GetAllCouponController {
    /** init services */
    protected getAllCouponService: GetAllCouponService<AccountRequest>;
    // * constructor
    constructor() {
        this.getAllCouponService = Container.get(GetAllCouponServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        /** execute getAll */
        const result = await this.getAllCouponService.execute();
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Get all coupons from database success',
            DT: { data: result.data }
        });
    });
}
