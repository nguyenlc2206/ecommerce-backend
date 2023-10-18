// * import libs
import { Request } from 'express';

// * import projects
import {
    CompareFieldsValidation,
    EmailValidation,
    EmailValidatorAdapter,
    RequiredFieldValidation,
    Validation,
    ValidationComposite
} from '@ecommerce-backend/src/shared/common/validations';

// ==============================||  VALIDATIONS FIELDS CREATE ACCOUNT ||============================== //

export class ValidationCreateAccount {
    // * constructor
    constructor() {}

    /** execute functions */
    execute = (req: Request) => {
        /** get information */
        const body = req.body;

        const validations: Validation[] = [];
        const fields = ['fullName', 'email', 'phoneNo', 'password', 'passwordConfirm'];

        /** @todo: Validate field requires **/
        for (const field of fields) {
            validations.push(new RequiredFieldValidation(field));
        }

        /** @todo: Compare password **/
        validations.push(new CompareFieldsValidation('password', 'passwordConfirm'));

        /** @todo: Validate Email **/
        const emailValidatorAdapter = new EmailValidatorAdapter();
        validations.push(new EmailValidation('email', emailValidatorAdapter));

        /** @todo: init validationComposite **/
        const validationComposite = new ValidationComposite(validations);

        return validationComposite.execute(body);
    };
}
