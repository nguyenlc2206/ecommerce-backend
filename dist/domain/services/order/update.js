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
exports.UpdateOrderServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
const _ = __importStar(require("lodash"));
// * import projects
const either_1 = require("../../../shared/common/either");
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const order_1 = require("../../../infrastructure/repositories/order");
let UpdateOrderServiceImpl = class UpdateOrderServiceImpl {
    /** init service */
    orderRepo;
    constructor() {
        this.orderRepo = typedi_1.Container.get(order_1.OrderRepositoryImpl);
    }
    /** execute function */
    async execute(entity) {
        /** get category from database */
        const resultGet = await this.handleGetOrder(entity?.id);
        if (resultGet.isFailure())
            return (0, either_1.failure)(resultGet.error);
        /** handle update order */
        const resultUpdate = await this.handelUpdateOrder(entity?.id, _.omit(entity, ['id']));
        if (resultUpdate.isFailure())
            return (0, either_1.failure)(resultUpdate.error);
        return (0, either_1.success)(resultUpdate.data);
    }
    // * get order from database
    handleGetOrder = async (id) => {
        const response = await this.orderRepo.getById(id);
        if (!response)
            return (0, either_1.failure)(new appError_1.default('Order is not exists!', 400));
        return (0, either_1.success)(response);
    };
    /** @todo: handle update order to database */
    handelUpdateOrder = async (id, entity) => {
        const response = await this.orderRepo.update(id, entity);
        return (0, either_1.success)(response);
    };
};
exports.UpdateOrderServiceImpl = UpdateOrderServiceImpl;
exports.UpdateOrderServiceImpl = UpdateOrderServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], UpdateOrderServiceImpl);
