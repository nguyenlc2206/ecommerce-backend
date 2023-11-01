// * import libs
import { Request } from 'express';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';

// ==============================||  VALIDATIONS FIELDS CREATE ORDER ||============================== //

export class ValidationCreateOrder {
    // * init ajv
    protected ajv: Ajv = new Ajv({ allErrors: true, $data: true });
    // * init shema
    protected schema = {
        type: 'object',
        properties: {
            orderItems: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            isNotEmpty: true,
                            errorMessage: { isNotEmpty: 'Missing field id!' }
                        },
                        name: {
                            type: 'string',
                            isNotEmpty: true,
                            errorMessage: { isNotEmpty: 'Missing field name!' }
                        },
                        size: {
                            type: 'string',
                            isNotEmpty: true,
                            errorMessage: { isNotEmpty: 'Missing field size!' }
                        },
                        qty: {
                            type: 'number',
                            minimum: 0
                        },
                        price: {
                            type: 'number',
                            minimum: 0
                        },
                        description: {
                            type: 'string'
                        }
                    },
                    required: ['id', 'name', 'size', 'qty', 'price']
                }
            },
            shippingAddress: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        isNotEmpty: true,
                        errorMessage: { isNotEmpty: 'Missing field firstname!' }
                    },
                    address: {
                        type: 'string',
                        isNotEmpty: true,
                        errorMessage: { isNotEmpty: 'Missing field address!' }
                    },
                    city: {
                        type: 'string',
                        isNotEmpty: true,
                        errorMessage: { isNotEmpty: 'Missing field city!' }
                    },
                    province: {
                        type: 'string',
                        isNotEmpty: true,
                        errorMessage: { isNotEmpty: 'Missing field province!' }
                    }
                },
                required: ['name', 'address']
            },
            totalPrice: { type: 'number', minimum: 0 },
            codes: { type: 'string' }
        },
        required: ['orderItems', 'shippingAddress', 'totalPrice'],
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
