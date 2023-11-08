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
exports.AccountRepositoryImpl = void 0;
// * import lib
const typedi_1 = require("typedi");
// * import projects
const Account_1 = __importDefault(require("../../infrastructure/schema/Account"));
// ==============================||  ACCOUNT REPOSITORY IMPLEMENT ||============================== //
let AccountRepositoryImpl = class AccountRepositoryImpl {
    // * constructor
    constructor() { }
    /** overiding create methods */
    async create(entity) {
        const result = await new Account_1.default(entity).save();
        return result;
    }
    /** overiding getByEmail methods */
    async getByEmail(email) {
        const result = await Account_1.default.findOne({ email }).select('+password');
        return result;
    }
    /** overiding update methods */
    async update(id, entity) {
        const result = await Account_1.default.findByIdAndUpdate(id, entity);
        return result;
    }
    /** overiding getById method */
    async getById(id) {
        const popObj = {
            path: 'AccountProductCart',
            select: 'id status products'
        };
        const result = await Account_1.default.findById(id).select('+password').populate(popObj);
        return result;
    }
    /** overiding getAll method */
    async getAll() {
        // const result = await AccountEntity.find().populate(popObj);
        const result = await Account_1.default.find();
        return result;
    }
    /** overiding delete method */
    async delete(id) {
        const result = await Account_1.default.findById(id);
        if (result) {
            result.isDeleted = true;
            result.deletedAt = new Date(Date.now());
            await result.save();
        }
    }
};
exports.AccountRepositoryImpl = AccountRepositoryImpl;
exports.AccountRepositoryImpl = AccountRepositoryImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], AccountRepositoryImpl);
