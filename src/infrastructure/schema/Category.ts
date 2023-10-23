// * import lib
import mongoose from 'mongoose';

/** init category schema */
const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please tell us name category!']
        },
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
            required: true
        },
        image: {
            type: String,
            required: [true, 'Please tell us link image!']
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
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
    },
    {
        timestamps: true,
        toJSON: { virtuals: true }
    }
);

/** define relation one to many product */
CategorySchema.virtual('CategoryProducts', {
    ref: 'Product', //The Model to use
    localField: '_id', //Find in Model, where localField
    foreignField: 'categoryId' // is equal to foreignField
});

// * compile the schema to model
const CategoryEntity = mongoose.model('Category', CategorySchema);

export default CategoryEntity;
