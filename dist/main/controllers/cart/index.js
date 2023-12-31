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
exports.ProductCartController = void 0;
// * import libs
const typedi_1 = require("typedi");
// import projects
const create_controller_1 = require("../../../main/controllers/cart/create.controller");
const getByAccountId_controller_1 = require("../../../main/controllers/cart/getByAccountId.controller");
const updateCart_1 = require("../../../main/controllers/cart/updateCart");
const delete_controller_1 = require("./delete.controller");
// ==============================||  PRODUCT CART CONTROLLER ||============================== //
let ProductCartController = class ProductCartController {
    /** constructor */
    constructor() { }
    /** create method */
    create = async (req, res, next) => {
        const _init = new create_controller_1.CreateProductCartController();
        return _init.execute(req, res, next);
    };
    /** get by account id */
    getByAccountId = async (req, res, next) => {
        const _init = new getByAccountId_controller_1.GetProductCartByAccountIdController();
        return _init.execute(req, res, next);
    };
    // * update cart
    update = async (req, res, next) => {
        const _init = new updateCart_1.UpdateProductCartController();
        return _init.execute(req, res, next);
    };
    // * delete cart
    delete = async (req, res, next) => {
        const _init = new delete_controller_1.DeleteProductCartController();
        return _init.execute(req, res, next);
    };
};
exports.ProductCartController = ProductCartController;
exports.ProductCartController = ProductCartController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], ProductCartController);
