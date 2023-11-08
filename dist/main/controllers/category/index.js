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
exports.CategoryController = void 0;
// * import libs
const typedi_1 = require("typedi");
// * import projects
const create_controller_1 = require("../../../main/controllers/category/create.controller");
const update_controller_1 = require("../../../main/controllers/category/update.controller");
const delete_controller_1 = require("../../../main/controllers/category/delete.controller");
const getAll_controller_1 = require("../../../main/controllers/category/getAll.controller");
const getById_controller_1 = require("../../../main/controllers/category/getById.controller");
// ==============================||  CATEGORY CONTROLLER ||============================== //
let CategoryController = class CategoryController {
    /** constructor */
    constructor() { }
    /** create method */
    create = async (req, res, next) => {
        const _init = new create_controller_1.CreateCategoryController();
        return _init.execute(req, res, next);
    };
    /** update method */
    update = async (req, res, next) => {
        const _init = new update_controller_1.UpdateCategoryController();
        return _init.execute(req, res, next);
    };
    /** delete method */
    delete = async (req, res, next) => {
        const _init = new delete_controller_1.DeleteCategoryController();
        return _init.execute(req, res, next);
    };
    // * get all categories
    getAll = async (req, res, next) => {
        const _init = new getAll_controller_1.GetAllCategoryController();
        return _init.execute(req, res, next);
    };
    // * get account by id
    getById = async (req, res, next) => {
        const _init = new getById_controller_1.GetCategoryByIdController();
        return _init.execute(req, res, next);
    };
};
exports.CategoryController = CategoryController;
exports.CategoryController = CategoryController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], CategoryController);
