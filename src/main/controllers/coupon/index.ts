// * import libs
import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import { CreateCouponController } from '@ecommerce-backend/src/main/controllers/coupon/create.controller';
import { DiscountController } from '@ecommerce-backend/src/main/controllers/coupon/discount.controller';
import { GetAllCouponController } from '@ecommerce-backend/src/main/controllers/coupon/getAll.controller';
import { DeleteCouponController } from '@ecommerce-backend/src/main/controllers/coupon/delete.controller';

// ==============================|| CREATE COUPON CONTROLLER ||============================== //

@Service()
export class CouponController {
    /** constructor */
    constructor() {}

    /** create method */
    create = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new CreateCouponController();
        return _init.execute(req, res, next);
    };

    /** discount method */
    discount = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new DiscountController();
        return _init.execute(req, res, next);
    };

    // * get all categories
    getAll = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new GetAllCouponController();
        return _init.execute(req, res, next);
    };

    /** delete method */
    delete = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new DeleteCouponController();
        return _init.execute(req, res, next);
    };
}
