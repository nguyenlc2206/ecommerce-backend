"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPService = void 0;
// * import libs
const typedi_1 = require("typedi");
const crypto_1 = __importDefault(require("crypto"));
const either_1 = require("../../shared/common/either");
const appError_1 = __importDefault(require("../../shared/common/appError"));
let OTPService = class OTPService {
    // * constructor
    constructor() { }
    /** overiding generateOTP method */
    async generateOTP() {
        const hex = crypto_1.default.randomBytes(3).toString('hex');
        const OTP = parseInt(hex, 16).toString().substr(0, 6);
        return OTP;
    }
    /** overiding createOTP method */
    async createNewOTP(entity, algorithm = 'sha256') {
        // console.log('>>>Check createNewOTP entity:', entity);
        const ttl = entity?.expiresAfter * 60 * 1000; //Expires after in Minutes, converteed to miliseconds
        const expires = Date.now() + ttl; //timestamp to 5 minutes in the future
        const data = `${entity?.phone}.${entity?.otp}.${expires}`; // phone.otp.expiry_timestamp
        const hashBase = crypto_1.default
            .createHmac(algorithm, entity?.key)
            .update(data)
            .digest('hex'); // creating SHA256 hash of the data
        const hash = `${hashBase}.${expires}`; // Hash.expires, format to send to the user
        return hash;
    }
    /** overiding verifyOTP method */
    async verifyOTP(entity, algorithm = 'sha256') {
        // console.log('>>>Check verifyOTP entity:', entity);
        if (!entity?.hash.match('.'))
            return (0, either_1.failure)(new appError_1.default('Something wrong from OTP!', 400)); // Hash should have at least one dot
        // Seperate Hash value and expires from the hash returned from the user(
        const [hashValue, expires] = entity?.hash.split('.');
        // Check if expiry time has passed
        const now = Date.now();
        if (now > expires)
            return (0, either_1.failure)(new appError_1.default('OTP is expired!', 400));
        // Calculate new hash with the same key and the same algorithm
        const data = `${entity?.phone}.${entity?.otp}.${expires}`;
        const newCalculatedHash = crypto_1.default
            .createHmac(algorithm, entity?.key)
            .update(data)
            .digest('hex');
        // Match the hashes
        if (newCalculatedHash === hashValue) {
            return (0, either_1.success)(true);
        }
        return (0, either_1.failure)(new appError_1.default('OTP is wrong!', 400));
    }
};
exports.OTPService = OTPService;
exports.OTPService = OTPService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], OTPService);
