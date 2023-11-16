"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// * import lib
const mongoose_1 = __importDefault(require("mongoose"));
//Generate random numbers for order
const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNumbers = Math.floor(1000 + Math.random() * 90000);
/** init Order schema */
const OrderSchema = new mongoose_1.default.Schema({
    accountId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
    paymentCharged: {
        type: Object,
        required: true
    },
    discounts: {
        type: Array,
        default: []
    },
    orderNumber: {
        type: String,
        default: randomTxt + randomNumbers
    },
    codes: {
        type: String
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
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancel']
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// * compile the schema to model
const OrderEntity = mongoose_1.default.model('Order', OrderSchema);
exports.default = OrderEntity;
