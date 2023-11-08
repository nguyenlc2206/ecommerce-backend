"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// * import libs
const mongoose_1 = __importDefault(require("mongoose"));
/** init OTP schema */
const OTPSchema = new mongoose_1.default.Schema({
    accountId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Account', required: true },
    OTP: { type: String },
    OTPCreatedTime: { type: Date },
    OTPAttempts: { type: Number, default: 0 },
    OTPType: { type: String, required: true },
    OTPRetry: { type: Number, required: true, default: 2 },
    isBlocked: { type: Boolean, default: false },
    blockUntil: { type: Date }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});
// * compile the schema to model
const OTPEntity = mongoose_1.default.model('OTP', OTPSchema);
exports.default = OTPEntity;
