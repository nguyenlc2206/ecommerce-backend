"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationUpdateAccount = void 0;
// * import projects
const validations_1 = require("../../../../shared/common/validations");
// ==============================||  VALIDATIONS FIELDS UPDATE ACCOUNT ||============================== //
class ValidationUpdateAccount {
    // * constructor
    constructor() { }
    /** execute functions */
    execute = (req) => {
        /** get information */
        const body = req.body;
        const validations = [];
        const fields = [...Object.keys(req.body)];
        /** @todo: Validate field requires **/
        if (fields.length) {
            for (const field of fields) {
                validations.push(new validations_1.RequiredFieldValidation(field));
            }
        }
        /** @todo: Validate Email **/
        if (fields.includes('email')) {
            const emailValidatorAdapter = new validations_1.EmailValidatorAdapter();
            validations.push(new validations_1.EmailValidation('email', emailValidatorAdapter));
        }
        /** @todo: Validate field valid **/
        validations.push(new validations_1.ValidFieldsValidation(fields, ['fullName', 'phoneNo', 'avatar', 'email']));
        /** @todo: init validationComposite **/
        const validationComposite = new validations_1.ValidationComposite(validations);
        return validationComposite.execute(body);
    };
}
exports.ValidationUpdateAccount = ValidationUpdateAccount;
