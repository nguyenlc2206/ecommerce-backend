"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// * import lib
const mongoose_1 = __importDefault(require("mongoose"));
/** init cart product schema */
const ProductCartSchema = new mongoose_1.default.Schema({
    products: [
        {
            type: Object,
            required: true
        }
    ],
    accountId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['initial', 'billing', 'payment'],
        default: 'initial'
    },
    billingAddress: {
        type: Object
    },
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// * compile the schema to model
const ProductCartEntity = mongoose_1.default.model('ProductCart', ProductCartSchema);
exports.default = ProductCartEntity;
