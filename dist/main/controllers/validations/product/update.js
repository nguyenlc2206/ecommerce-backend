"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationUpdateProduct = void 0;
// * import projects
const validations_1 = require("../../../../shared/common/validations");
// ==============================||  VALIDATIONS FIELDS UPDATE PRODUCT ||============================== //
class ValidationUpdateProduct {
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
        /** @todo: Validate field valid **/
        validations.push(new validations_1.ValidFieldsValidation(fields, ['name', 'description', 'images']));
        /** @todo: init validationComposite **/
        const validationComposite = new validations_1.ValidationComposite(validations);
        return validationComposite.execute(body);
    };
}
exports.ValidationUpdateProduct = ValidationUpdateProduct;
