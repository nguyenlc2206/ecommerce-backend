// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { DeleteOrderService, DeleteOrderServiceImpl } from '@ecommerce-backend/src/domain/services/order/delete';

// ==============================||  DELETE CATEGORY CONTROLLER ||============================== //
@Service()
export class DeleteOrderController {
    /** init services */
    protected deleteOrderService: DeleteOrderService<AccountRequest>;

    // * constructor
    constructor() {
        this.deleteOrderService = Container.get(DeleteOrderServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        /** execute service */
        const result = await this.deleteOrderService.execute(req);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Delete order success',
            DT: {}
        });
    });
}
