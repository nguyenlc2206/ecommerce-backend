"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// * import libs
const mongoose_1 = __importDefault(require("mongoose"));
/** init Token schema */
const TokenSchema = new mongoose_1.default.Schema({
    accountId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Account', required: true },
    token: { type: String, required: true },
    createdTime: { type: Date, required: true }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});
// * compile the schema to model
const TokenEntity = mongoose_1.default.model('Token', TokenSchema);
exports.default = TokenEntity;
