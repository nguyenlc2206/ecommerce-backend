// * import lib
import mongoose from 'mongoose';

/** init product schema */
const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please tell us name product!']
        },
        description: {
            type: String,
            required: [true, 'Please tell us description product!']
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
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
            type: mongoose.Schema.Types.ObjectId,
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
                type: mongoose.Schema.Types.ObjectId,
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
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

/** define relation one to many category */
ProductSchema.virtual('ProductSize', {
    ref: 'ProductSize', //The Model to use
    localField: '_id', //Find in Model, where localField
    foreignField: 'productId' // is equal to foreignField
});

// * compile the schema to model
const ProductEntity = mongoose.model('Product', ProductSchema);

export default ProductEntity;
