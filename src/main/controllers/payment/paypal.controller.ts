// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import {
    PaypalUpdateOrderService,
    PaypalUpdateOrderServiceImpl
} from '@ecommerce-backend/src/domain/services/payment/paypal/update';
import { KeyedObject } from '@ecommerce-backend/src/shared/types';
import { failure } from '@ecommerce-backend/src/shared/common/either';

// ==============================||  PAYPAL CONTROLLER ||============================== //

@Service()
export class PaypalController {
    // init service
    protected paypalUpdateOrder: PaypalUpdateOrderService<KeyedObject>;
    // constructor
    constructor() {
        this.paypalUpdateOrder = Container.get(PaypalUpdateOrderServiceImpl);
    }

    // * execute method
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // excute service
        const response = await this.paypalUpdateOrder.excute(req);
        if (response.isFailure()) return failure(response.error);

        console.log('>>>Check status:', response.data);

        if (response.data.toString() === 'COMPLETED') {
            // * processing response
            res.render(`${process.cwd()}/src/shared/templates/ejs/paymentStatus`, {
                alert: true,
                alertTitle: 'Great!!',
                alertMessage: 'Payment with paypal success !!'
            });
        }
        res.render(`${process.cwd()}/src/shared/templates/ejs/paymentStatus`, {
            alert: true,
            alertTitle: 'Oops!',
            alertMessage: 'Something went wrong!'
        });
    });
}
