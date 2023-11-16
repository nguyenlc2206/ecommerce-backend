// * import libs
import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import { CreateOrderController } from '@ecommerce-backend/src/main/controllers/order/create.controller';
import { DeleteOrderController } from '@ecommerce-backend/src/main/controllers/order/delete.controller';
import { GetAllOrderController } from '@ecommerce-backend/src/main/controllers/order/getAll.controller';
import { GetOrderByIdController } from '@ecommerce-backend/src/main/controllers/order/getById.controller';
import { GetPaginationOrderController } from '@ecommerce-backend/src/main/controllers/order/getPagination.controller';
import { GetOrderByAccountIdController } from '@ecommerce-backend/src/main/controllers/order/getByAccountId';

// ==============================||  ORDER CONTROLLER ||============================== //
@Service()
export class OrderController {
    /** constructor */
    constructor() {}

    /** create method */
    create = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new CreateOrderController();
        return _init.execute(req, res, next);
    };

    /** delete method */
    delete = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new DeleteOrderController();
        return _init.execute(req, res, next);
    };

    // * get all categories
    getAll = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new GetAllOrderController();
        return _init.execute(req, res, next);
    };

    // * get by id
    getById = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new GetOrderByIdController();
        return _init.execute(req, res, next);
    };

    // * get by id
    getPaginate = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new GetPaginationOrderController();
        return _init.execute(req, res, next);
    };

    // * get by account id
    getOrderMe = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new GetOrderByAccountIdController();
        return _init.execute(req, res, next);
    };
}
