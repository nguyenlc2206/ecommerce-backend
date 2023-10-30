// * import libs
import { Request } from 'express';

// * import projects
import {
    RequiredFieldValidation,
    ValidFieldsValidation,
    Validation,
    ValidationComposite
} from '@ecommerce-backend/src/shared/common/validations';

// ==============================||  VALIDATIONS FIELDS UPDATE CATEGORY ||============================== //

export class ValidationUpdateCategory {
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

        /** @todo: Validate field valid **/
        validations.push(new ValidFieldsValidation(fields, ['name']));

        /** @todo: init validationComposite **/
        const validationComposite = new ValidationComposite(validations);

        return validationComposite.execute(body);
    };
}
