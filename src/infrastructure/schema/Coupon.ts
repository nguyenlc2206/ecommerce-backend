// * import libs
import mongoose from 'mongoose';

/** init account entity schema */
const CouponSchema = new mongoose.Schema(
    {
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        },
        type: {
            type: String,
            enum: ['personal', 'all'],
            default: 'all'
        },
        accountIdExpires: [
            {
                type: mongoose.Schema.Types.ObjectId,
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
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// * compile the schema to model
const CouponEntity = mongoose.model('Coupon', CouponSchema);

export default CouponEntity;
