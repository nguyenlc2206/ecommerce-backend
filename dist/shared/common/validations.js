"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationComposite = exports.CompareFieldsValidation = exports.EmailValidation = exports.EmailValidatorAdapter = exports.RequiredFieldValidation = exports.ValidFieldsValidation = void 0;
// * import libs
const validator_1 = __importDefault(require("validator"));
// * import projects
const appError_1 = __importDefault(require("../../shared/common/appError"));
/** @todo: validation valid fields */
class ValidFieldsValidation {
    arrayFields;
    fieldsValidUpdate;
    constructor(arrayFields, fieldsValidUpdate) {
        this.arrayFields = arrayFields;
        this.fieldsValidUpdate = fieldsValidUpdate;
    }
    containsAny(source, target) {
        let isFound = true;
        target.map((name) => {
            if (!source.includes(name))
                isFound = false;
        });
        return isFound;
    }
    execute(input) {
        let isFound = this.containsAny(this.fieldsValidUpdate, this.arrayFields);
        if (!isFound) {
            return new appError_1.default(`Something wrong from fields input!`, 400);
        }
    }
}
exports.ValidFieldsValidation = ValidFieldsValidation;
/** @todo: validation requierd fields */
class RequiredFieldValidation {
    fieldName;
    constructor(fieldName) {
        this.fieldName = fieldName;
    }
    execute(input) {
        if (!input[this.fieldName] || input[this.fieldName].length === 0) {
            return new appError_1.default(`Missing field ${this.fieldName}!`, 400);
        }
    }
}
exports.RequiredFieldValidation = RequiredFieldValidation;
class EmailValidatorAdapter {
    isValid(email) {
        return validator_1.default.isEmail(email);
    }
}
exports.EmailValidatorAdapter = EmailValidatorAdapter;
class EmailValidation {
    fieldName;
    emailValidator;
    constructor(fieldName, emailValidator) {
        this.fieldName = fieldName;
        this.emailValidator = emailValidator;
    }
    execute(input) {
        const isValidEmail = this.emailValidator.isValid(input[this.fieldName]);
        if (!isValidEmail) {
            return new appError_1.default(`Something wrong from ${this.fieldName}!`, 400);
        }
    }
}
exports.EmailValidation = EmailValidation;
/** @todo: compare fields */
class CompareFieldsValidation {
    fieldName;
    fieldToCompare;
    constructor(fieldName, fieldToCompare) {
        this.fieldName = fieldName;
        this.fieldToCompare = fieldToCompare;
    }
    execute(input) {
        if (input[this.fieldName].length !== input[this.fieldToCompare].length) {
            return new appError_1.default(`Length is not same ${this.fieldToCompare}!`, 400);
        }
        if (input[this.fieldName] !== input[this.fieldToCompare]) {
            return new appError_1.default(`Content is not same ${this.fieldToCompare}!`, 400);
        }
    }
}
exports.CompareFieldsValidation = CompareFieldsValidation;
/** @todo: execute validations  */
class ValidationComposite {
    validations;
    constructor(validations) {
        this.validations = validations;
    }
    execute(input) {
        // console.log('>>>Check validations:', this.validations);
        for (const validation of this.validations) {
            const error = validation.execute(input);
            if (error)
                return error;
        }
    }
}
exports.ValidationComposite = ValidationComposite;
