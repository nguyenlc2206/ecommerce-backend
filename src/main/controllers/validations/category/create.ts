// * import libs
import { Request } from 'express';

// * import projects
import {
    RequiredFieldValidation,
    Validation,
    ValidationComposite
} from '@ecommerce-backend/src/shared/common/validations';
import AppError from '@ecommerce-backend/src/shared/common/appError';

// ==============================||  VALIDATIONS FIELDS CREATE CATEGORY ||============================== //

export class ValidationCreateCategory {
    // * constructor
    constructor() {}

    /** execute functions */
    execute = (req: Request) => {
        /** get information */
        const body = req.body;

        const validations: Validation[] = [];
        const fields = ['name'];

        /** @todo: Validate field requires **/
        for (const field of fields) {
            validations.push(new RequiredFieldValidation(field));
        }

        /** @todo: validation image file */
        if (!req.file) return new AppError('Missing field image!', 400);

        /** @todo: init validationComposite **/
        const validationComposite = new ValidationComposite(validations);

        return validationComposite.execute(body);
    };
}
