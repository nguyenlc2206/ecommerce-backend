// * import libs
import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import { SendEmailSupportController } from '@ecommerce-backend/src/main/controllers/email/support.controller';

// ==============================|| EMAIL CONTROLLER ||============================== //

@Service()
export class EmailController {
    /** constructor */
    constructor() {}

    /** create method */
    support = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new SendEmailSupportController();
        return _init.execute(req, res, next);
    };
}
