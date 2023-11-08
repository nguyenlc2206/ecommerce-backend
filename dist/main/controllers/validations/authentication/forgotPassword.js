"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationForgotPassword = void 0;
// * import projects
const validations_1 = require("../../../../shared/common/validations");
// ==============================||  VALIDATIONS FIELDS FORGOT PASSWORD ||============================== //
class ValidationForgotPassword {
    // * constructor
    constructor() { }
    /** execute functions */
    execute = (req) => {
        /** get information */
        const body = req.body;
        const validations = [];
        const fields = ['email'];
        /** @todo: Validate field requires **/
        for (const field of fields) {
            validations.push(new validations_1.RequiredFieldValidation(field));
        }
        /** @todo: Validate Email **/
        const emailValidatorAdapter = new validations_1.EmailValidatorAdapter();
        validations.push(new validations_1.EmailValidation('email', emailValidatorAdapter));
        /** @todo: init validationComposite **/
        const validationComposite = new validations_1.ValidationComposite(validations);
        return validationComposite.execute(body);
    };
}
exports.ValidationForgotPassword = ValidationForgotPassword;
