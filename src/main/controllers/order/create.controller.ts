// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { CreateOrderService, CreateOrderServiceImpl } from '@ecommerce-backend/src/domain/services/order/create';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { ValidationCreateOrder } from '@ecommerce-backend/src/main/controllers/validations/order/create';

// ==============================||  CREATE ORDER CONTROLLER ||============================== //

@Service()
export class CreateOrderController {
    /** init validation */
    protected validation = new ValidationCreateOrder();
    protected createOrderService: CreateOrderService<AccountRequest>;

    // * constructor
    constructor() {
        this.createOrderService = Container.get(CreateOrderServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // * validations fields
        const validation = this.validation.execute(req);
        if (validation) return next(validation);

        //* execute service
        const response = await this.createOrderService.execute(req);
        if (response.isFailure()) return next(response.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Insert order to database success',
            DT: { data: response.data }
        });
    });
}
