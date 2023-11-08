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
exports.TokenRepositoryImpl = void 0;
// * import lib
const typedi_1 = require("typedi");
// * import projects
const Token_1 = __importDefault(require("../../infrastructure/schema/Token"));
// ==============================||  OTP REPOSITORY IMPLEMENT ||============================== //
let TokenRepositoryImpl = class TokenRepositoryImpl {
    // * constructor
    constructor() { }
    /** overiding create method */
    async create(entity) {
        const result = await new Token_1.default(entity).save();
        return result;
    }
    /** overding delete method */
    async delete(token) {
        await Token_1.default.findOneAndDelete({ token: token });
    }
    /** overiding getByaccountId method */
    async getByaccountId(id, token) {
        const result = await Token_1.default.findOne({ accountId: id, token: token });
        return result;
    }
};
exports.TokenRepositoryImpl = TokenRepositoryImpl;
exports.TokenRepositoryImpl = TokenRepositoryImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], TokenRepositoryImpl);
