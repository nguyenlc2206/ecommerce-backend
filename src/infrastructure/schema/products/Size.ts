// * import lib
import mongoose from 'mongoose';

/** init product schema */
const ProductSizeSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
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
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// * compile the schema to model
const ProductSizeEntity = mongoose.model('ProductSize', ProductSizeSchema);

export default ProductSizeEntity;
