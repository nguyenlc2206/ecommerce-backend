"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationCreateProduct = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv_errors_1 = __importDefault(require("ajv-errors"));
// * import projects
const appError_1 = __importDefault(require("../../../../shared/common/appError"));
// ==============================||  VALIDATIONS FIELDS CREATE PRODUCT ||============================== //
class ValidationCreateProduct {
    // * init ajv
    ajv = new ajv_1.default({ allErrors: true, $data: true });
    // * init shema
    schema = {
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
                    type: 'string',
                    isNotEmpty: true,
                    errorMessage: { isNotEmpty: 'Missing field items!' }
                }
            }
        },
        required: ['name', 'description', 'categoryId', 'sizes'],
        additionalProperties: true
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
exports.ValidationCreateProduct = ValidationCreateProduct;
