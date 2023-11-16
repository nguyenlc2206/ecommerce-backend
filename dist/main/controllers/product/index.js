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
exports.ProductController = void 0;
// * import libs
const typedi_1 = require("typedi");
// * import projects
const create_controller_1 = require("../../../main/controllers/product/create.controller");
const update_controller_1 = require("../../../main/controllers/product/update.controller");
const delete_controller_1 = require("../../../main/controllers/product/delete.controller");
const getById_controller_1 = require("../../../main/controllers/product/getById.controller");
const getAll_controller_1 = require("../../../main/controllers/product/getAll.controller");
const query_controller_1 = require("../../../main/controllers/product/query.controller");
const getAllSize_controller_1 = require("../../../main/controllers/product/getAllSize.controller");
const createSize_controller_1 = require("../../../main/controllers/product/createSize.controller");
const filter_controller_1 = require("../../../main/controllers/product/filter.controller");
const active_controller_1 = require("../../../main/controllers/product/active.controller");
const sort_cotroller_1 = require("../../../main/controllers/product/sort.cotroller");
// ==============================||  PRODUCT CONTROLLER ||============================== //
let ProductController = class ProductController {
    /** constructor */
    constructor() { }
    /** create method */
    create = async (req, res, next) => {
        const _init = new create_controller_1.CreateProductController();
        return _init.execute(req, res, next);
    };
    /** update method */
    update = async (req, res, next) => {
        const _init = new update_controller_1.UpdateProductController();
        return _init.execute(req, res, next);
    };
    /** delete method */
    delete = async (req, res, next) => {
        const _init = new delete_controller_1.DeleteProductController();
        return _init.execute(req, res, next);
    };
    // * get product by id
    getById = async (req, res, next) => {
        const _init = new getById_controller_1.GetProductByIdController();
        return _init.execute(req, res, next);
    };
    // * get all products
    getAll = async (req, res, next) => {
        const _init = new getAll_controller_1.GetAllProductController();
        return _init.execute(req, res, next);
    };
    // * query
    query = async (req, res, next) => {
        const _init = new query_controller_1.QueryProductsController();
        return _init.execute(req, res, next);
    };
    // * filter
    filter = async (req, res, next) => {
        const _init = new filter_controller_1.FilterProductsController();
        return _init.execute(req, res, next);
    };
    // * getAll products size
    getAllSize = async (req, res, next) => {
        const _init = new getAllSize_controller_1.GetAllSizeProductController();
        return _init.execute(req, res, next);
    };
    // * create size
    createSize = async (req, res, next) => {
        const _init = new createSize_controller_1.CreateProductSizeController();
        return _init.execute(req, res, next);
    };
    // * active account
    active = async (req, res, next) => {
        const _init = new active_controller_1.ActiveProductController();
        return _init.execute(req, res, next);
    };
    // * active account
    sort = async (req, res, next) => {
        const _init = new sort_cotroller_1.SortProductController();
        return _init.execute(req, res, next);
    };
};
exports.ProductController = ProductController;
exports.ProductController = ProductController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], ProductController);
