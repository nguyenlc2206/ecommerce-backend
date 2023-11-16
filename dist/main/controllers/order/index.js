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
exports.OrderController = void 0;
// * import libs
const typedi_1 = require("typedi");
// * import projects
const create_controller_1 = require("../../../main/controllers/order/create.controller");
const delete_controller_1 = require("../../../main/controllers/order/delete.controller");
const getAll_controller_1 = require("../../../main/controllers/order/getAll.controller");
const getById_controller_1 = require("../../../main/controllers/order/getById.controller");
const getPagination_controller_1 = require("../../../main/controllers/order/getPagination.controller");
const getByAccountId_1 = require("../../../main/controllers/order/getByAccountId");
// ==============================||  ORDER CONTROLLER ||============================== //
let OrderController = class OrderController {
    /** constructor */
    constructor() { }
    /** create method */
    create = async (req, res, next) => {
        const _init = new create_controller_1.CreateOrderController();
        return _init.execute(req, res, next);
    };
    /** delete method */
    delete = async (req, res, next) => {
        const _init = new delete_controller_1.DeleteOrderController();
        return _init.execute(req, res, next);
    };
    // * get all categories
    getAll = async (req, res, next) => {
        const _init = new getAll_controller_1.GetAllOrderController();
        return _init.execute(req, res, next);
    };
    // * get by id
    getById = async (req, res, next) => {
        const _init = new getById_controller_1.GetOrderByIdController();
        return _init.execute(req, res, next);
    };
    // * get by id
    getPaginate = async (req, res, next) => {
        const _init = new getPagination_controller_1.GetPaginationOrderController();
        return _init.execute(req, res, next);
    };
    // * get by account id
    getOrderMe = async (req, res, next) => {
        const _init = new getByAccountId_1.GetOrderByAccountIdController();
        return _init.execute(req, res, next);
    };
};
exports.OrderController = OrderController;
exports.OrderController = OrderController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], OrderController);
