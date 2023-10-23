// * import libs
import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import { CreateProductController } from '@ecommerce-backend/src/main/controllers/product/create.controller';

// ==============================||  PRODUCT CONTROLLER ||============================== //
@Service()
export class ProductController {
    /** constructor */
    constructor() {}

    /** create method */
    create = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new CreateProductController();
        return _init.execute(req, res, next);
    };
}
