// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { KeyedObject } from '@ecommerce-backend/src/shared/types';
import { Email } from '@ecommerce-backend/src/shared/common/email';
import { ValidationSupportEmail } from '@ecommerce-backend/src/main/controllers/validations/email/support';

// ==============================||  SEND EMAIL CONTROLLER ||============================== //

@Service()
export class SendEmailSupportController {
    /** init validation */
    protected emailService: Email<KeyedObject>;
    protected validation = new ValidationSupportEmail();

    // * constructor
    constructor() {
        this.emailService = Container.get(Email);
    }

    /** execute method */
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // * validations fields
        const valitions = this.validation.execute(req);
        if (valitions) return next(valitions);

        //* execute service
        const response = await this.emailService.sendEmailSupport({
            email: req?.body?.email,
            supportText: req?.body?.supportText
        });

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Send email success!',
            DT: {}
        });
    });
}
