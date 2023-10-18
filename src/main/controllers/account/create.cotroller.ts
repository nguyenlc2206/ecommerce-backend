// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';
import { CreateAccountService, CreateAccountServiceImpl } from '@ecommerce-backend/src/domain/services/account/create';
import { Validation } from '@ecommerce-backend/src/shared/common/validations';
import { ValidationCreateAccount } from '@ecommerce-backend/src/main/controllers/validations/account/create';

// ==============================||  CREATE ACCOUNT CONTROLLER ||============================== //

@Service()
export class CreateAccountController {
    protected validation: Validation = new ValidationCreateAccount();
    protected createAccountService: CreateAccountService<AccountModel>;

    // * constructor
    constructor() {
        this.createAccountService = Container.get(CreateAccountServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // * validations fields
        const validations = this.validation.execute(req);
        if (validations) return next(validations);

        // * execute account services
        const data: AccountModel = { ...req.body };
        const result = await this.createAccountService.execute(data);
        if (result.isFailure()) return next(result.error);

        const { data: account } = result;

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Insert user to database success',
            DT: { data: account }
        });
    });
}
