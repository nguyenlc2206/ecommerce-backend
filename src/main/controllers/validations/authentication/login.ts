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

// ==============================||  VALIDATIONS FIELDS LOGIN ||============================== //

export class ValidationLogin {
    // * constructor
    constructor() {}

    /** execute functions */
    execute = (req: Request) => {
        /** get information */
        const body = req.body;

        const validations: Validation[] = [];
        const fields = ['email', 'password'];

        /** @todo: Validate field requires **/
        for (const field of fields) {
            validations.push(new RequiredFieldValidation(field));
        }

        /** @todo: Validate Email **/
        const emailValidatorAdapter = new EmailValidatorAdapter();
        validations.push(new EmailValidation('email', emailValidatorAdapter));

        /** @todo: init validationComposite **/
        const validationComposite = new ValidationComposite(validations);

        return validationComposite.execute(body);
    };
}
