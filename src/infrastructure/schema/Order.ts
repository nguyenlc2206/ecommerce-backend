// * import lib
import mongoose from 'mongoose';

//Generate random numbers for order
const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNumbers = Math.floor(1000 + Math.random() * 90000);

/** init Order schema */
const OrderSchema = new mongoose.Schema(
    {
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
            required: true
        },
        orderItems: [
            {
                type: Object,
                required: true
            }
        ],
        shippingAddress: {
            type: Object,
            required: true
        },
        orderNumber: {
            type: String,
            default: randomTxt + randomNumbers
        },
        //for stripe payment
        paymentStatus: {
            type: String,
            default: 'Not paid'
        },
        paymentMethod: {
            type: String,
            default: 'Not specified'
        },
        totalPrice: {
            type: Number,
            default: 0.0
        },
        currency: {
            type: String,
            default: 'Not specified'
        },
        //For admin
        status: {
            type: String,
            default: 'pending',
            enum: ['pending', 'processing', 'shipped', 'delivered']
        },
        deliveredAt: {
            type: Date
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
const OrderEntity = mongoose.model('Order', OrderSchema);

export default OrderEntity;
