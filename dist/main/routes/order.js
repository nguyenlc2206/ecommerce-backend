"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const typedi_1 = require("typedi");
// * import projects
const order_1 = require("../../main/controllers/order");
const authentication_1 = require("../../main/controllers/authentication");
const middleware_1 = __importDefault(require("../../shared/common/middleware"));
/** init controller */
const instanceOrder = typedi_1.Container.get(order_1.OrderController);
const instanceAuth = typedi_1.Container.get(authentication_1.AuthenticationController);
/** @todo: init routes */
const OrderRoutes = (router) => {
    // * ceate order
    router.post('/order', instanceAuth.protect, instanceOrder.create);
    /** delete method */
    router.delete('/order/:id', instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceOrder.delete);
    /** getAll method */
    router.get('/order/getAll', instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceOrder.getAll);
    /** get account by id */
    router.get('/order/:id', instanceAuth.protect, instanceOrder.getById);
    /** get paginate method*/
    router.get('/order?:page?:limit', instanceAuth.protect, instanceOrder.getPaginate);
};
exports.OrderRoutes = OrderRoutes;
