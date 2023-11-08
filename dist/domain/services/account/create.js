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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountServiceImpl = void 0;
// * import libs
const fs_1 = __importDefault(require("fs"));
require("reflect-metadata");
const typedi_1 = require("typedi");
const _ = __importStar(require("lodash"));
// * import projects
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const env_1 = __importDefault(require("../../../main/config/env"));
const Account_1 = require("../../../domain/models/Account");
const account_impl_1 = require("../../../infrastructure/repositories/account.impl");
const either_1 = require("../../../shared/common/either");
const bcrypt_1 = require("../../../shared/common/bcrypt");
const cloudinary_1 = require("../../../shared/common/cloudinary");
let CreateAccountServiceImpl = class CreateAccountServiceImpl {
    accountRepo;
    cloudinary;
    // * constructor
    constructor() {
        this.accountRepo = typedi_1.Container.get(account_impl_1.AccountRepositoryImpl);
        this.cloudinary = typedi_1.Container.get(cloudinary_1.Cloudinary);
    }
    /** overiding execute method */
    async execute(entity) {
        /** check email in database */
        const _checkEmail = await this.handleCheckEmail(entity?.email);
        if (_checkEmail.isFailure())
            return (0, either_1.failure)(_checkEmail.error);
        /** hash password */
        const _hashPassword = await this.handleHashPassword(entity?.password);
        const _entity = { ...entity, password: _hashPassword };
        let __entity = { ..._entity };
        /** handle cloudinary iamge */
        if (entity.file) {
            let img = fs_1.default.readFileSync(entity.file.path);
            const params = {
                database64: 'data:image/png;base64,' + img.toString('base64'),
                package: 'AvatarImages',
                publicId: entity?.email
            };
            const resImage = await this.handleGetLinkImage(params);
            if (resImage.isFailure())
                return (0, either_1.failure)(resImage.error);
            __entity = { ..._entity, avatar: resImage.data };
        }
        else {
            __entity = {
                ..._entity,
                avatar: 'https://res.cloudinary.com/dybi8swhy/image/upload/v1698151700/ImagesCommon/image-account-default.png'
            };
        }
        /** create account */
        const response = await this.accountRepo.create(_.omit(__entity, 'file'));
        const _init = new Account_1.AccountModel();
        const result = _init.fromAccountModel(response);
        return (0, either_1.success)(result);
    }
    // * check email in database
    handleCheckEmail = async (email) => {
        const response = await this.accountRepo.getByEmail(email);
        if (!response)
            return (0, either_1.success)(undefined);
        return (0, either_1.failure)(new appError_1.default('Email is already!', 400));
    };
    // * hash password
    handleHashPassword = async (password) => {
        const { bcryptSalt } = env_1.default;
        const hasher = new bcrypt_1.BcryptAdapter(bcryptSalt);
        const hashedPassword = await hasher.hash(password);
        return hashedPassword;
    };
    //* handle cloudinary iamge
    handleGetLinkImage = async (params) => {
        const response = await this.cloudinary.uploadImage(params);
        return (0, either_1.success)(response?.url);
    };
};
exports.CreateAccountServiceImpl = CreateAccountServiceImpl;
exports.CreateAccountServiceImpl = CreateAccountServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], CreateAccountServiceImpl);
