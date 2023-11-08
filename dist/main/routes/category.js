"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const typedi_1 = require("typedi");
// * import projects
const category_1 = require("../../main/controllers/category");
const authentication_1 = require("../../main/controllers/authentication");
const middleware_1 = __importDefault(require("../../shared/common/middleware"));
const uploadFile_1 = __importDefault(require("../../shared/common/uploadFile"));
/** init controller */
const instanceCategory = typedi_1.Container.get(category_1.CategoryController);
const instanceAuth = typedi_1.Container.get(authentication_1.AuthenticationController);
/** @todo: init routes */
const CategoryRoutes = (router) => {
    /** create method */
    router.post('/category', uploadFile_1.default.single('image'), instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceCategory.create);
    /** update method */
    router.patch('/category/:id', instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceCategory.update);
    /** delete method */
    router.delete('/category/:id', instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceCategory.delete);
    /** getAll mwthod */
    router.get('/category/getAll', instanceAuth.protect, instanceCategory.getAll);
    /** get account by id */
    router.get('/category/:id', instanceAuth.protect, instanceCategory.getById);
};
exports.CategoryRoutes = CategoryRoutes;
