// * import libs
import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import { CreateProductController } from '@ecommerce-backend/src/main/controllers/product/create.controller';
import { UpdateProductController } from '@ecommerce-backend/src/main/controllers/product/update.controller';
import { DeleteProductController } from '@ecommerce-backend/src/main/controllers/product/delete.controller';
import { GetProductByIdController } from '@ecommerce-backend/src/main/controllers/product/getById.controller';
import { GetAllProductController } from '@ecommerce-backend/src/main/controllers/product/getAll.controller';
import { QueryProductsController } from '@ecommerce-backend/src/main/controllers/product/query.controller';
import { GetAllSizeProductController } from '@ecommerce-backend/src/main/controllers/product/getAllSize.controller';
import { CreateProductSizeController } from '@ecommerce-backend/src/main/controllers/product/createSize.controller';
import { FilterProductsController } from '@ecommerce-backend/src/main/controllers/product/filter.controller';
import { ActiveProductController } from '@ecommerce-backend/src/main/controllers/product/active.controller';
import { SortProductController } from '@ecommerce-backend/src/main/controllers/product/sort.cotroller';

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

    // * query
    query = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new QueryProductsController();
        return _init.execute(req, res, next);
    };

    // * filter
    filter = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new FilterProductsController();
        return _init.execute(req, res, next);
    };

    // * getAll products size
    getAllSize = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new GetAllSizeProductController();
        return _init.execute(req, res, next);
    };

    // * create size
    createSize = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new CreateProductSizeController();
        return _init.execute(req, res, next);
    };

    // * active account
    active = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new ActiveProductController();
        return _init.execute(req, res, next);
    };

    // * active account
    sort = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new SortProductController();
        return _init.execute(req, res, next);
    };
}
