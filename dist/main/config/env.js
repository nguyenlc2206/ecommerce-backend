"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
/** init dotenv */
dotenv.config();
const { env } = process;
// * define ENV
const ENV = {
    portDB: env.PORT_DB || 5432,
    usernameDB: env.USER || '',
    databaseURL: env.DATABASE || '',
    databasePassword: env.DATABASE_PASSWORD || '',
    bcryptSalt: Number(env.BCRYPT_SALT) || 12,
    jwtSecret: env.JWT_SECRET || 'any_secret_1tJK==__02&sdA',
    expiresIn: env.JWT_EXPIRES_IN || '1h',
    cloudinaryName: env.CLOUDINARY_NAME || '',
    cloudinaryKey: env.CLOUDINARY_KEY || '',
    cloudinarySecret: env.CLOUDINARY_SECRET || '',
    emailUsername: env.EMAIL_USERNAME || '',
    emailPassword: env.EMAIL_PASSWORD || '',
    emailHost: env.EMAIL_HOST || undefined,
    emailPort: Number(env.EMAIL_PORT) || 0,
    emailFrom: env.EMAIL_FROM || '',
    stripeSecretKey: env.STRIPE_SECRET_KEY || ''
};
exports.default = ENV;
