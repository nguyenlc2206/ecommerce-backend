"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// * import lib
const mongoose_1 = __importDefault(require("mongoose"));
/** init product schema */
const ProductSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us name product!']
    },
    description: {
        type: String,
        required: [true, 'Please tell us description product!']
    },
    categoryId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    sizes: {
        type: [String],
        enum: ['S', 'M', 'L', 'XL', 'XXL']
    },
    colors: {
        type: [String]
    },
    accountId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    reviews: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Review'
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
/** define relation one to many category */
ProductSchema.virtual('ProductSize', {
    ref: 'ProductSize',
    localField: '_id',
    foreignField: 'productId' // is equal to foreignField
});
// * compile the schema to model
const ProductEntity = mongoose_1.default.model('Product', ProductSchema);
exports.default = ProductEntity;
