"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// * import lib
const mongoose_1 = __importDefault(require("mongoose"));
/** init category schema */
const CategorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us name category!']
    },
    accountId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    image: {
        type: String,
        required: [true, 'Please tell us link image!']
    },
    products: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});
/** define relation one to many product */
CategorySchema.virtual('CategoryProducts', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'categoryId' // is equal to foreignField
});
// * compile the schema to model
const CategoryEntity = mongoose_1.default.model('Category', CategorySchema);
exports.default = CategoryEntity;
