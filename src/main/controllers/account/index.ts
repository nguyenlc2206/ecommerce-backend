// * import lib
import 'reflect-metadata';
import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import project
import { CreateAccountController } from '@ecommerce-backend/src/main/controllers/account/create.cotroller';
import { UpdateMeAccountController } from '@ecommerce-backend/src/main/controllers/account/updateMe.controller';
import { GetAccountMeController } from '@ecommerce-backend/src/main/controllers/account/getMe.controller';
import { GetAllAccountController } from '@ecommerce-backend/src/main/controllers/account/getAll.cotroller';
import { DeleteAccountController } from '@ecommerce-backend/src/main/controllers/account/delete.controller';
import { UpdateAccountController } from '@ecommerce-backend/src/main/controllers/account/update.controller';
import { GetAccountByIdController } from '@ecommerce-backend/src/main/controllers/account/getById.controller';

// ==============================||  ACCOUNT CONTROLLER ||============================== //

@Service()
export class AccountController {
    // * constructor
    constructor() {}

    // * create method
    create = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new CreateAccountController();
        return _init.execute(req, res, next);
    };

    // * update account me method
    updateMe = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new UpdateMeAccountController();
        return _init.execute(req, res, next);
    };

    // * update account method
    update = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new UpdateAccountController();
        return _init.execute(req, res, next);
    };

    // * get account me
    getMe = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new GetAccountMeController();
        return _init.execute(req, res, next);
    };

    // * get account by id
    getById = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new GetAccountByIdController();
        return _init.execute(req, res, next);
    };

    // * get all account
    getAll = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new GetAllAccountController();
        return _init.execute(req, res, next);
    };

    // * delete account
    delete = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new DeleteAccountController();
        return _init.execute(req, res, next);
    };
}
