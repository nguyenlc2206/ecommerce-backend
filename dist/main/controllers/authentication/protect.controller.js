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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtectedRoutesController = void 0;
const typedi_1 = require("typedi");
// * import projects
const catchAsync_1 = __importDefault(require("../../../shared/common/catchAsync"));
const protected_1 = require("../../../domain/services/authentication/protected");
// ==============================||  PROTECTED CONTROLLER CONTROLLER ||============================== //
let ProtectedRoutesController = class ProtectedRoutesController {
    protectedService;
    // * constructor
    constructor() {
        this.protectedService = typedi_1.Container.get(protected_1.ProtectedServiceImpl);
    }
    // * execute method
    execute = (0, catchAsync_1.default)(async (req, res, next) => {
        // * execute protect services
        const response = await this.protectedService.execute(req);
        if (response.isFailure())
            return next(response.error);
        // * processing response
        req.account = response.data;
        req.accountId = response.data?.id;
        req.accessToken = response.data?.accessToken;
        req.password = response.data?.password;
        next();
    });
};
exports.ProtectedRoutesController = ProtectedRoutesController;
exports.ProtectedRoutesController = ProtectedRoutesController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], ProtectedRoutesController);
