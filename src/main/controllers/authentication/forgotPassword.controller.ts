// * import libs
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { Validation } from '@ecommerce-backend/src/shared/common/validations';
import { ValidationForgotPassword } from '@ecommerce-backend/src/main/controllers/validations/authentication/forgotPassword';
import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';
import { GenerateOTPService, GenerateOTPServiceImpl } from '@ecommerce-backend/src/domain/services/otp/generateOTP';

// ==============================||  FORGOT PASSWORD CONTROLLER ||============================== //

@Service()
export class ForgotPasswordController {
    protected validation: Validation = new ValidationForgotPassword();
    protected generateOTPService: GenerateOTPService<AccountModel>;

    // * constructor
    constructor() {
        this.generateOTPService = Container.get(GenerateOTPServiceImpl);
    }

    // * execute function
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // * validation fields
        const validation = this.validation.execute(req);
        if (validation) return next(validation);

        // * execute forgot password service
        const data: AccountModel = { ...req.body };
        const result = await this.generateOTPService.execute(data);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: `Send OTP to email ${req.body?.email} success`,
            DT: { data: result.data }
        });
    });
}
