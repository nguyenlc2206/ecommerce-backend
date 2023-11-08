"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// * import lib
const mongoose_1 = __importDefault(require("mongoose"));
/** init product schema */
const ProductSizeSchema = new mongoose_1.default.Schema({
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L', 'XL', 'XXL']
    },
    color: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    totalQty: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true,
        default: 0
    },
    totalSold: {
        type: Number,
        required: true,
        default: 0
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
const ProductSizeEntity = mongoose_1.default.model('ProductSize', ProductSizeSchema);
exports.default = ProductSizeEntity;
