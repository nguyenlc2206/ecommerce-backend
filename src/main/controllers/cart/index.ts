// * import libs
import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// import projects
import { CreateProductCartController } from '@ecommerce-backend/src/main/controllers/cart/create.controller';
import { GetProductCartByAccountIdController } from '@ecommerce-backend/src/main/controllers/cart/getByAccountId.controller';
import { UpdateProductCartController } from '@ecommerce-backend/src/main/controllers/cart/updateCart';
import { DeleteProductCartController } from './delete.controller';

// ==============================||  PRODUCT CART CONTROLLER ||============================== //
@Service()
export class ProductCartController {
    /** constructor */
    constructor() {}

    /** create method */
    create = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new CreateProductCartController();
        return _init.execute(req, res, next);
    };

    /** get by account id */
    getByAccountId = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new GetProductCartByAccountIdController();
        return _init.execute(req, res, next);
    };

    // * update cart
    update = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new UpdateProductCartController();
        return _init.execute(req, res, next);
    };

    // * delete cart
    delete = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new DeleteProductCartController();
        return _init.execute(req, res, next);
    };
}
