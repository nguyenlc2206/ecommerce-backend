// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { Validation } from '@ecommerce-backend/src/shared/common/validations';
import { ValidationUpdateAccount } from '@ecommerce-backend/src/main/controllers/validations/account/update';
import {
    UpdateAccountMeService,
    UpdateAccountMeServiceImpl
} from '@ecommerce-backend/src/domain/services/account/updateMe';

// ==============================||  UPDATE ACCOUNT ME CONTROLLER ||============================== //

@Service()
export class UpdateMeAccountController {
    /** init service */
    protected validation: Validation = new ValidationUpdateAccount();
    protected updateAccountService: UpdateAccountMeService<AccountRequest>;

    // * constructor
    constructor() {
        this.updateAccountService = Container.get(UpdateAccountMeServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        // * validations fields
        const validations = this.validation.execute(req);
        if (validations) return next(validations);

        // * update execute
        const result = await this.updateAccountService.execute(req);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Update account to database success',
            DT: { data: result.data }
        });
    });
}
