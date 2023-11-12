// * import lib
import mongoose from 'mongoose';

/** init cart product schema */
const ProductCartSchema = new mongoose.Schema(
    {
        products: [
            {
                type: Object,
                required: true
            }
        ],
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
            required: true
        },
        discounts: [{ type: Object }],
        paymentMethod: { type: String },
        status: {
            type: String,
            required: true,
            enum: ['initial', 'billing', 'payment', 'complete'],
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
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// * compile the schema to model
const ProductCartEntity = mongoose.model('ProductCart', ProductCartSchema);

export default ProductCartEntity;
