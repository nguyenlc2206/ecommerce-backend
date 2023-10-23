// * import libs
import mongoose from 'mongoose';

/** init Token schema */
const TokenSchema = new mongoose.Schema(
    {
        accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
        token: { type: String, required: true },
        createdTime: { type: Date, required: true }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true }
    }
);

// * compile the schema to model
const TokenEntity = mongoose.model('Token', TokenSchema);

export default TokenEntity;
