// * import libs
import { Request } from 'express';

// * import projects
import {
    CompareFieldsValidation,
    RequiredFieldValidation,
    Validation,
    ValidationComposite
} from '@ecommerce-backend/src/shared/common/validations';

// ==============================||  VALIDATIONS FIELDS CHANGE PASSWORD ||============================== //

export class ValidationChangePassword {
    // * constructor
    constructor() {}

    /** execute functions */
    execute = (req: Request) => {
        /** get information */
        const body = req.body;

        const validations: Validation[] = [];
        const fields = ['passwordCurrent', 'password', 'passwordConfirm'];

        /** @todo: Validate field requires **/
        for (const field of fields) {
            validations.push(new RequiredFieldValidation(field));
        }

        /** @todo: Compare password **/
        validations.push(new CompareFieldsValidation('password', 'passwordConfirm'));

        /** @todo: init validationComposite **/
        const validationComposite = new ValidationComposite(validations);

        return validationComposite.execute(body);
    };
}
