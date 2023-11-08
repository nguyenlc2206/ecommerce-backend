"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// * import libs
const mongoose_1 = __importDefault(require("mongoose"));
/** init account entity schema */
const CouponSchema = new mongoose_1.default.Schema({
    code: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    discount: {
        type: Number,
        required: true,
        default: 0
    },
    accountId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Account'
    },
    type: {
        type: String,
        enum: ['personal', 'all'],
        default: 'all'
    },
    accountIdExpires: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Account'
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
// * compile the schema to model
const CouponEntity = mongoose_1.default.model('Coupon', CouponSchema);
exports.default = CouponEntity;
