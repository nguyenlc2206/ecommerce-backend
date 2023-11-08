"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationCreateCategory = void 0;
// * import projects
const validations_1 = require("../../../../shared/common/validations");
const appError_1 = __importDefault(require("../../../../shared/common/appError"));
// ==============================||  VALIDATIONS FIELDS CREATE CATEGORY ||============================== //
class ValidationCreateCategory {
    // * constructor
    constructor() { }
    /** execute functions */
    execute = (req) => {
        /** get information */
        const body = req.body;
        const validations = [];
        const fields = ['name'];
        /** @todo: Validate field requires **/
        for (const field of fields) {
            validations.push(new validations_1.RequiredFieldValidation(field));
        }
        /** @todo: validation image file */
        if (!req.file)
            return new appError_1.default('Missing field image!', 400);
        /** @todo: init validationComposite **/
        const validationComposite = new validations_1.ValidationComposite(validations);
        return validationComposite.execute(body);
    };
}
exports.ValidationCreateCategory = ValidationCreateCategory;
