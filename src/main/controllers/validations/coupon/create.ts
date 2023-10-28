// * import libs
import { Request } from 'express';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';

// ==============================||  VALIDATIONS FIELDS CREATE COUPON ||============================== //

export class ValidationCreateCoupon {
    // * init ajv
    protected ajv: Ajv = new Ajv({ allErrors: true, $data: true });
    // * init shema
    protected schema = {
        type: 'object',
        properties: {
            code: { type: 'string', isNotEmpty: true, errorMessage: { isNotEmpty: 'Missing field code!' } },
            discount: { type: 'string', isNotEmpty: true, errorMessage: { isNotEmpty: 'Missing field discount!' } },
            startDate: { type: 'string', isNotEmpty: true, errorMessage: { isNotEmpty: 'Missing field startDate!' } },
            endDate: { type: 'string', isNotEmpty: true, errorMessage: { isNotEmpty: 'Missing field endDate!' } }
        },
        required: ['code', 'discount', 'startDate', 'endDate'],
        additionalProperties: true
    };

    constructor() {
        addFormats(this.ajv);
        ajvErrors(this.ajv);
        /** add key isNotEmpty */
        this.ajv.addKeyword({
            keyword: 'isNotEmpty',
            type: 'string',
            validate: function (schema: any, data: any) {
                return typeof data === 'string' && data.trim() !== '';
            },
            errors: false
        });
    }

    /** execute functions */
    execute = (req: Request) => {
        /** get information */
        const validate = this.ajv.compile(this.schema);
        const valid = validate(req.body);
        if (!valid) return new AppError(this.ajv.errorsText(validate.errors), 400);
    };
}
