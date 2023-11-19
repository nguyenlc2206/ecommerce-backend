// * import libs
import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import { PaypalController } from '@ecommerce-backend/src/main/controllers/payment/paypal.controller';

// ==============================||  PAYMENT CONTROLLER ||============================== //
@Service()
export class PaymentController {
    /** constructor */
    constructor() {}

    /** paypal method */
    paypal = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new PaypalController();
        return _init.execute(req, res, next);
    };
}
