"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationChangePassword = void 0;
// * import projects
const validations_1 = require("../../../../shared/common/validations");
// ==============================||  VALIDATIONS FIELDS CHANGE PASSWORD ||============================== //
class ValidationChangePassword {
    // * constructor
    constructor() { }
    /** execute functions */
    execute = (req) => {
        /** get information */
        const body = req.body;
        const validations = [];
        const fields = ['passwordCurrent', 'password', 'passwordConfirm'];
        /** @todo: Validate field requires **/
        for (const field of fields) {
            validations.push(new validations_1.RequiredFieldValidation(field));
        }
        /** @todo: Compare password **/
        validations.push(new validations_1.CompareFieldsValidation('password', 'passwordConfirm'));
        /** @todo: init validationComposite **/
        const validationComposite = new validations_1.ValidationComposite(validations);
        return validationComposite.execute(body);
    };
}
exports.ValidationChangePassword = ValidationChangePassword;
