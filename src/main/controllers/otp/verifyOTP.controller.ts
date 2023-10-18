// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { Validation } from '@ecommerce-backend/src/shared/common/validations';
import { ValidationVerifyOTP } from '@ecommerce-backend/src/main/controllers/validations/otp/verify';
import { VerifyOTPService, VerifyOTPServiceImpl } from '@ecommerce-backend/src/domain/services/otp/verifyOTP';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';

// ==============================||  VERIFY OTP CONTROLLER ||============================== //
@Service()
export class VerifyOTPController {
    protected validation: Validation = new ValidationVerifyOTP();
    protected verifyOTPService: VerifyOTPService<AccountRequest>;

    /** constructor */
    constructor() {
        this.verifyOTPService = Container.get(VerifyOTPServiceImpl);
    }

    // * execute method
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // * validations fields
        const validations = this.validation.execute(req);
        if (validations) return next(validations);

        // * execute verify OTP
        const result = await this.verifyOTPService.execute(req);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Verify OTP success',
            DT: {}
        });
    });
}
