// * import libs
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { Validation } from '@ecommerce-backend/src/shared/common/validations';
import { ValidationChangePassword } from '@ecommerce-backend/src/main/controllers/validations/authentication/changePassword';
import {
    ChangePasswordAdminService,
    ChangePasswordAdminServiceImpl
} from '@ecommerce-backend/src/domain/services/authentication/changePasswordAdmin';

// ==============================||  CHANGE PASSWORD ADMIN CONTROLLER ||============================== //

@Service()
export class ChangePasswordAdminController {
    /** init variable */
    protected validation: Validation = new ValidationChangePassword();
    protected changePasswordService: ChangePasswordAdminService<AccountRequest>;

    // * constructor
    constructor() {
        this.changePasswordService = Container.get(ChangePasswordAdminServiceImpl);
    }

    // * execute method
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        // * validation fields
        const validation = this.validation.execute(req);
        if (validation) return next(validation);

        // * execute services change password
        const response = await this.changePasswordService.execute(req);
        if (response.isFailure()) return next(response.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Change password success',
            DT: {}
        });
    });
}
