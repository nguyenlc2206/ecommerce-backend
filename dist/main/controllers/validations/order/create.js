"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationCreateOrder = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv_errors_1 = __importDefault(require("ajv-errors"));
// * import projects
const appError_1 = __importDefault(require("../../../../shared/common/appError"));
// ==============================||  VALIDATIONS FIELDS CREATE ORDER ||============================== //
class ValidationCreateOrder {
    // * init ajv
    ajv = new ajv_1.default({ allErrors: true, $data: true });
    // * init shema
    schema = {
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
        (0, ajv_formats_1.default)(this.ajv);
        (0, ajv_errors_1.default)(this.ajv);
        /** add key isNotEmpty */
        this.ajv.addKeyword({
            keyword: 'isNotEmpty',
            type: 'string',
            validate: function (schema, data) {
                return typeof data === 'string' && data.trim() !== '';
            },
            errors: false
        });
    }
    /** execute functions */
    execute = (req) => {
        /** get information */
        const validate = this.ajv.compile(this.schema);
        const valid = validate(req.body);
        if (!valid)
            return new appError_1.default(this.ajv.errorsText(validate.errors), 400);
    };
}
exports.ValidationCreateOrder = ValidationCreateOrder;
