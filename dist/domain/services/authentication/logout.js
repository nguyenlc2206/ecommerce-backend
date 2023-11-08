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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
// * import projects
const either_1 = require("../../../shared/common/either");
const account_impl_1 = require("../../../infrastructure/repositories/account.impl");
const token_impl_1 = require("../../../infrastructure/repositories/token.impl");
let LogoutServiceImpl = class LogoutServiceImpl {
    /** init repo */
    accountRepo;
    tokenRepo;
    // * constructor
    constructor() {
        this.accountRepo = typedi_1.Container.get(account_impl_1.AccountRepositoryImpl);
        this.tokenRepo = typedi_1.Container.get(token_impl_1.TokenRepositoryImpl);
    }
    /** overiding execute method */
    async execute(entity) {
        await this.tokenRepo.delete(entity?.accessToken);
        return (0, either_1.success)({});
    }
};
exports.LogoutServiceImpl = LogoutServiceImpl;
exports.LogoutServiceImpl = LogoutServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], LogoutServiceImpl);
