"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationVerifyOTP = void 0;
// * import projects
const validations_1 = require("../../../../shared/common/validations");
// ==============================||  VALIDATIONS FIELDS VERIFY OTP ||============================== //
class ValidationVerifyOTP {
    fields;
    validations;
    // * constructor
    constructor() {
        this.fields = ['email', 'OTP', 'OTPType'];
        this.validations = [];
    }
    /** define otp fields functions */
    OTPReducer = (type) => {
        switch (type) {
            case 'OTPForgotPassword': {
                /** @todo: Compare password **/
                this.validations.push(new validations_1.CompareFieldsValidation('password', 'passwordConfirm'));
                return [...this.fields, 'password', 'passwordConfirm'];
            }
            default: {
                return [...this.fields];
            }
        }
    };
    /** execute functions */
    execute = (req) => {
        /** get information */
        const body = req.body;
        const type = req.body?.OTPType;
        this.fields = this.OTPReducer(type);
        /** @todo: Validate field requires **/
        for (const field of this.fields) {
            this.validations.push(new validations_1.RequiredFieldValidation(field));
        }
        /** @todo: Validate Email **/
        const emailValidatorAdapter = new validations_1.EmailValidatorAdapter();
        this.validations.push(new validations_1.EmailValidation('email', emailValidatorAdapter));
        /** @todo: init validationComposite **/
        const validationComposite = new validations_1.ValidationComposite(this.validations);
        return validationComposite.execute(body);
    };
}
exports.ValidationVerifyOTP = ValidationVerifyOTP;
