// * import libs
import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import { CreateProductController } from '@ecommerce-backend/src/main/controllers/product/create.controller';
import { UpdateProductController } from '@ecommerce-backend/src/main/controllers/product/update.controller';
import { DeleteProductController } from '@ecommerce-backend/src/main/controllers/product/delete.controller';
import { GetProductByIdController } from '@ecommerce-backend/src/main/controllers/product/getById.controller';
import { GetAllProductController } from '@ecommerce-backend/src/main/controllers/product/getAll.controller';
import { GetProductByIdAndSizeController } from '@ecommerce-backend/src/main/controllers/product/getByIdAndSize';

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

    /** update method */
    update = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new UpdateProductController();
        return _init.execute(req, res, next);
    };

    /** delete method */
    delete = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new DeleteProductController();
        return _init.execute(req, res, next);
    };

    // * get product by id
    getById = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new GetProductByIdController();
        return _init.execute(req, res, next);
    };

    // * get all products
    getAll = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new GetAllProductController();
        return _init.execute(req, res, next);
    };

    // * getByIdAndSize
    getByIdAndSize = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new GetProductByIdAndSizeController();
        return _init.execute(req, res, next);
    };
}
