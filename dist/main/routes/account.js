"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRoutes = void 0;
const typedi_1 = require("typedi");
// * import projects
const index_1 = require("../../main/controllers/account/index");
const authentication_1 = require("../../main/controllers/authentication");
const middleware_1 = __importDefault(require("../../shared/common/middleware"));
const uploadFile_1 = __importDefault(require("../../shared/common/uploadFile"));
/** init instance */
const instanceAccount = typedi_1.Container.get(index_1.AccountController);
const instanceAuth = typedi_1.Container.get(authentication_1.AuthenticationController);
// console.log('>>>Check instance:', instance);
/** @todo: init routes */
const AccountRoutes = (router) => {
    /** active account */
    router.get('/account/active/:id', instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceAccount.active);
    /** get account me */
    router.get('/account-me', instanceAuth.protect, instanceAccount.getMe);
    /** update account me */
    router.post('/account/update-me', uploadFile_1.default.single('avatar'), instanceAuth.protect, instanceAccount.updateMe);
    /** get all account */
    router.get('/account/getAll', instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceAccount.getAll);
    /** delete account */
    router.delete('/account/:id', instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceAccount.delete);
    /** update account */
    router.post('/account/update/:id', uploadFile_1.default.single('avatar'), instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceAccount.update);
    /** get account by id */
    router.get('/account/:id', instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceAccount.getById);
};
exports.AccountRoutes = AccountRoutes;
