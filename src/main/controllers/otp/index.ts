// * import libs
import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { VerifyOTPController } from './verifyOTP.controller';

// * import projects

// ==============================||  OTP CONTROLLER ||============================== //
@Service()
export class OTPController {
    /** constructor */
    constructor() {}

    /** verifyOTP method */
    verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new VerifyOTPController();
        return _init.execute(req, res, next);
    };
}
