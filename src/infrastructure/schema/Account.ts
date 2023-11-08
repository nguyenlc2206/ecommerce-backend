// * import libs
import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

/** init account entity schema */
const AccountSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Please tell us your name!'],
            loswercase: true
        },
        phoneNo: {
            type: String,
            required: [true, 'Please tell us your phone!']
        },
        avatar: {
            type: String,
            required: false,
            default: null
        },
        email: {
            type: String,
            required: [true, 'Please tell us your email!'],
            unique: true,
            loswercase: true,
            validate: [validator.isEmail, 'Please provide a valid email']
        },
        password: {
            type: String,
            required: [true, 'Please tell us your password!'],
            minlength: 6,
            select: false
        },
        role: {
            type: String,
            enum: ['admin', 'manager', 'staff', 'customer'],
            default: 'customer'
        },
        passwordChangedAt: {
            type: Date,
            default: Date.now
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        },
        shippingAddress: {
            name: {
                type: String
            },
            address: {
                type: String
            },
            city: {
                type: String
            },
            province: {
                type: String
            }
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

/** define relation one to many category */
AccountSchema.virtual('AccountCategories', {
    ref: 'Category', //The Model to use
    localField: '_id', //Find in Model, where localField
    foreignField: 'accountId' // is equal to foreignField
});

/** define relation one to many product */
AccountSchema.virtual('AccountProducts', {
    ref: 'Product', //The Model to use
    localField: '_id', //Find in Model, where localField
    foreignField: 'accountId' // is equal to foreignField
});

/** define relation one to many order */
AccountSchema.virtual('AccountOrder', {
    ref: 'Order', //The Model to use
    localField: '_id', //Find in Model, where localField
    foreignField: 'accountId' // is equal to foreignField
});

/** define relation one to many coupon */
AccountSchema.virtual('AccountCoupon', {
    ref: 'Coupon', //The Model to use
    localField: '_id', //Find in Model, where localField
    foreignField: 'accountId' // is equal to foreignField
});

/** define relation one to many product cart */
AccountSchema.virtual('AccountProductCart', {
    ref: 'ProductCart', //The Model to use
    localField: '_id', //Find in Model, where localField
    foreignField: 'accountId' // is equal to foreignField
});

// * compile the schema to model
const AccountEntity = mongoose.model('Account', AccountSchema);

export default AccountEntity;
