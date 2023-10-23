// * import libs
import { Request } from 'express';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';

// ==============================||  VALIDATIONS FIELDS CREATE PRODUCT ||============================== //

export class ValidationCreateProduct {
    // * init ajv
    protected ajv: Ajv = new Ajv({ allErrors: true, $data: true });
    // * init shema
    protected schema = {
        type: 'object',
        properties: {
            name: { type: 'string', isNotEmpty: true, errorMessage: { isNotEmpty: 'Missing field name!' } },
            description: {
                type: 'string',
                isNotEmpty: true,
                errorMessage: { isNotEmpty: 'Missing field description!' }
            },
            categoryId: { type: 'string', isNotEmpty: true, errorMessage: { isNotEmpty: 'Missing field categoryId!' } },
            sizes: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        size: {
                            type: 'string',
                            isNotEmpty: true,
                            errorMessage: { isNotEmpty: 'Missing field size!' }
                        },
                        price: {
                            type: 'number',
                            minimum: 0
                        },
                        totalQty: {
                            type: 'number',
                            minimum: 0
                        }
                    },
                    required: ['size', 'price', 'totalQty']
                }
            },
            images: { type: 'array', minItems: 1, items: { type: 'string' } }
        },
        required: ['name', 'description', 'categoryId', 'sizes', 'images'],
        additionalProperties: false
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
