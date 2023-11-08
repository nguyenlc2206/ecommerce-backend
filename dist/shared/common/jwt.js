"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenGeneratorAdapter = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenGeneratorAdapter {
    jwtSecret;
    expiresIn;
    constructor(jwtSecret, expiresIn) {
        this.jwtSecret = jwtSecret;
        this.expiresIn = expiresIn;
    }
    async generate(key) {
        return jsonwebtoken_1.default.sign({ key }, this.jwtSecret, {
            expiresIn: this.expiresIn
        });
    }
    async decrypt(token) {
        const decode = jsonwebtoken_1.default.verify(token, this.jwtSecret);
        return decode;
    }
}
exports.TokenGeneratorAdapter = TokenGeneratorAdapter;
