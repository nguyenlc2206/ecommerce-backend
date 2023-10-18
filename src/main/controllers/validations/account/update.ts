// * import libs
import { Request } from 'express';

// * import projects
import {
    EmailValidation,
    EmailValidatorAdapter,
    RequiredFieldValidation,
    ValidFieldsValidation,
    Validation,
    ValidationComposite
} from '@ecommerce-backend/src/shared/common/validations';

// ==============================||  VALIDATIONS FIELDS UPDATE ACCOUNT ||============================== //

export class ValidationUpdateAccount {
    // * constructor
    constructor() {}

    /** execute functions */
    execute = (req: Request) => {
        /** get information */
        const body = req.body;

        const validations: Validation[] = [];

        const fields: Array<string> = [...Object.keys(req.body)];
        /** @todo: Validate field requires **/
        if (fields.length) {
            for (const field of fields) {
                validations.push(new RequiredFieldValidation(field));
            }
        }

        /** @todo: Validate Email **/
        if (fields.includes('email')) {
            const emailValidatorAdapter = new EmailValidatorAdapter();
            validations.push(new EmailValidation('email', emailValidatorAdapter));
        }

        /** @todo: Validate field valid **/
        validations.push(new ValidFieldsValidation(fields));

        /** @todo: init validationComposite **/
        const validationComposite = new ValidationComposite(validations);

        return validationComposite.execute(body);
    };
}
