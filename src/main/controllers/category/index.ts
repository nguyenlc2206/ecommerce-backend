// * import libs
import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import { CreateCategoryController } from '@ecommerce-backend/src/main/controllers/category/create.controller';
import { UpdateCategoryController } from '@ecommerce-backend/src/main/controllers/category/update.controller';
import { DeleteCategoryController } from '@ecommerce-backend/src/main/controllers/category/delete.controller';
import { GetAllCategoryController } from '@ecommerce-backend/src/main/controllers/category/getAll.controller';
import { GetCategoryByIdController } from '@ecommerce-backend/src/main/controllers/category/getById.controller';

// ==============================||  CATEGORY CONTROLLER ||============================== //
@Service()
export class CategoryController {
    /** constructor */
    constructor() {}

    /** create method */
    create = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new CreateCategoryController();
        return _init.execute(req, res, next);
    };

    /** update method */
    update = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new UpdateCategoryController();
        return _init.execute(req, res, next);
    };

    /** delete method */
    delete = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new DeleteCategoryController();
        return _init.execute(req, res, next);
    };

    // * get all categories
    getAll = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new GetAllCategoryController();
        return _init.execute(req, res, next);
    };

    // * get account by id
    getById = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new GetCategoryByIdController();
        return _init.execute(req, res, next);
    };
}
