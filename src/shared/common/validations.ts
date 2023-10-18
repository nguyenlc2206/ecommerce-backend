// * import libs
import validator from 'validator';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';

// ==============================|| VALIDATION FIELDS ||============================== //

/** Define validation function */
export interface Validation {
    execute(input: any): void | Error;
}

/** @todo: validation valid fields */
export class ValidFieldsValidation implements Validation {
    protected fieldsValidUpdate: Array<string> = ['fullName', 'phoneNo', 'avatar', 'email'];
    constructor(private readonly arrayFields: Array<string>) {}

    containsAny(source: Array<string>, target: Array<string>) {
        let isFound = true;
        target.map((name) => {
            if (!source.includes(name)) isFound = false;
        });
        return isFound;
    }

    execute(input: any): void | Error {
        let isFound = this.containsAny(this.fieldsValidUpdate, this.arrayFields);
        if (!isFound) {
            return new AppError(`Something wrong from fields input!`, 400);
        }
    }
}

/** @todo: validation requierd fields */
export class RequiredFieldValidation implements Validation {
    constructor(private readonly fieldName: string) {}

    execute(input: any): void | Error {
        if (!input[this.fieldName] || input[this.fieldName].length === 0) {
            return new AppError(`Missing field ${this.fieldName}!`, 400);
        }
    }
}

/** @todo: validation email */
export interface EmailValidator {
    isValid: (email: string) => boolean;
}

export class EmailValidatorAdapter implements EmailValidator {
    isValid(email: string): boolean {
        return validator.isEmail(email);
    }
}

export class EmailValidation implements Validation {
    constructor(
        private readonly fieldName: string,
        private readonly emailValidator: EmailValidator
    ) {}

    execute<T extends Record<string, string>>(input: T): void | Error {
        const isValidEmail = this.emailValidator.isValid(input[this.fieldName]);
        if (!isValidEmail) {
            return new AppError(`Something wrong from ${this.fieldName}!`, 400);
        }
    }
}

/** @todo: compare fields */
export class CompareFieldsValidation implements Validation {
    constructor(
        private readonly fieldName: string,
        private readonly fieldToCompare: string
    ) {}

    execute<T extends Record<string, string>>(input: T): void | Error {
        if (input[this.fieldName].length !== input[this.fieldToCompare].length) {
            return new AppError(`Length is not same ${this.fieldToCompare}!`, 400);
        }
        if (input[this.fieldName] !== input[this.fieldToCompare]) {
            return new AppError(`Content is not same ${this.fieldToCompare}!`, 400);
        }
    }
}

/** @todo: execute validations  */
export class ValidationComposite implements Validation {
    constructor(private readonly validations: Validation[]) {}

    execute(input: any): void | Error {
        // console.log('>>>Check validations:', this.validations);
        for (const validation of this.validations) {
            const error = validation.execute(input);
            if (error) return error;
        }
    }
}
