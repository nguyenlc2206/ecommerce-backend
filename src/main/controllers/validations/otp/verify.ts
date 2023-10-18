// * import libs
import { Request } from 'express';

// * import projects
import {
    CompareFieldsValidation,
    EmailValidation,
    EmailValidatorAdapter,
    RequiredFieldValidation,
    Validation,
    ValidationComposite
} from '@ecommerce-backend/src/shared/common/validations';

// ==============================||  VALIDATIONS FIELDS VERIFY OTP ||============================== //

export class ValidationVerifyOTP {
    protected fields: Array<string>;
    protected validations: Validation[];

    // * constructor
    constructor() {
        this.fields = ['email', 'OTP', 'OTPType'];
        this.validations = [];
    }

    /** define otp fields functions */
    OTPReducer = (type: string) => {
        switch (type) {
            case 'OTPForgotPassword': {
                /** @todo: Compare password **/
                this.validations.push(new CompareFieldsValidation('password', 'passwordConfirm'));
                return [...this.fields, 'password', 'passwordConfirm'] as Array<string>;
            }
            default: {
                return [...this.fields];
            }
        }
    };

    /** execute functions */
    execute = (req: Request) => {
        /** get information */
        const body = req.body;
        const type = req.body?.OTPType;

        this.fields = this.OTPReducer(type);

        /** @todo: Validate field requires **/
        for (const field of this.fields) {
            this.validations.push(new RequiredFieldValidation(field));
        }

        /** @todo: Validate Email **/
        const emailValidatorAdapter = new EmailValidatorAdapter();
        this.validations.push(new EmailValidation('email', emailValidatorAdapter));

        /** @todo: init validationComposite **/
        const validationComposite = new ValidationComposite(this.validations);

        return validationComposite.execute(body);
    };
}
