// * import libs
import mongoose from 'mongoose';

/** init OTP schema */
const OTPSchema = new mongoose.Schema(
    {
        accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
        OTP: { type: String },
        OTPCreatedTime: { type: Date },
        OTPAttempts: { type: Number, default: 0 },
        OTPType: { type: String, required: true },
        OTPRetry: { type: Number, required: true, default: 2 },
        isBlocked: { type: Boolean, default: false },
        blockUntil: { type: Date }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true }
    }
);

// * compile the schema to model
const OTPEntity = mongoose.model('OTP', OTPSchema);

export default OTPEntity;
