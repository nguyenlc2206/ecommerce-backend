"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const typedi_1 = require("typedi");
// * import projects
const product_1 = require("../../main/controllers/product");
const authentication_1 = require("../../main/controllers/authentication");
const middleware_1 = __importDefault(require("../../shared/common/middleware"));
const uploadFile_1 = __importDefault(require("../../shared/common/uploadFile"));
const cart_1 = require("../../main/controllers/cart");
/** init controller */
const instanceProduct = typedi_1.Container.get(product_1.ProductController);
const instanceAuth = typedi_1.Container.get(authentication_1.AuthenticationController);
const instanceProductCart = typedi_1.Container.get(cart_1.ProductCartController);
/** @todo: init routes */
const ProductRoutes = (router) => {
    /** active method */
    router.get('/product/active/:id', instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceProduct.active);
    /** create method */
    router.post('/product', uploadFile_1.default.array('images'), instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceProduct.create);
    /** get product search*/
    router.get('/product/search', instanceAuth.protect, instanceProduct.query);
    /** add product cart */
    router.post('/product/cart', instanceAuth.protect, instanceProductCart.create);
    /** update product cart */
    router.patch('/product/cart', instanceAuth.protect, instanceProductCart.update);
    /** delete product cart */
    router.delete('/product/cart/:id', instanceAuth.protect, instanceProductCart.delete);
    /** get product cart by account id*/
    router.get('/product/cart', instanceAuth.protect, instanceProductCart.getByAccountId);
    /** create size method */
    router.post('/product/size', instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceProduct.createSize);
    /** update method */
    router.patch('/product/:id', instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceProduct.update);
    /** delete method */
    router.delete('/product/:id', instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceProduct.delete);
    /** sort method */
    router.get('/product/sort', instanceAuth.protect, instanceProduct.sort);
    /** getAll method */
    router.get('/product/getAll', instanceAuth.protect, instanceProduct.getAll);
    /** get product size by id */
    router.get('/product/sizes/:id', instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceProduct.getAllSize);
    /** filter product */
    router.post('/product/filter', instanceAuth.protect, instanceProduct.filter);
    /** get product by id */
    router.get('/product/:id', instanceAuth.protect, instanceProduct.getById);
};
exports.ProductRoutes = ProductRoutes;
