"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressConfig = void 0;
// * import lib
const express_1 = __importDefault(require("express"));
// * import project
const catchAsync_1 = __importDefault(require("../../shared/common/catchAsync"));
const cors_1 = __importDefault(require("../../main/config/cors"));
const routes_1 = __importDefault(require("../../main/config/routes"));
const appError_1 = __importDefault(require("../../shared/common/appError"));
const controllerError_1 = __importDefault(require("../../shared/common/controllerError"));
const injection_1 = __importDefault(require("../../main/config/injection"));
const stripe_1 = __importDefault(require("./stripe"));
// ==============================||  EXPRESS CONFIG ||============================== //
class ExpressConfig {
    app;
    port;
    /** constructor */
    constructor(express, port) {
        this.app = express;
        this.port = port;
    }
    /** define function init */
    init = (0, catchAsync_1.default)(async () => {
        /** cors config */
        (0, cors_1.default)(this.app);
        /** Webhook config */
        (0, stripe_1.default)(this.app);
        /** json pareser */
        this.app.use(express_1.default.json({ limit: '50mb' }));
        //url encoded
        this.app.use(express_1.default.urlencoded({ extended: true }));
        /** limiter request from same API */
        // const limiter = rateLimit({
        //     max: 100,
        //     windowMs: 60 * 60 * 1000,
        //     message: 'Too many requests from this IP, please try again in an hour!'
        // });
        // this.app.use('/api', limiter);
        /** injecttion config */
        (0, injection_1.default)();
        /** routes config */
        (0, routes_1.default)(this.app);
        /** check url not support in this server */
        this.app.all('*', (req, res, next) => {
            next(new appError_1.default(`Unsupport path ${req.originalUrl} on this server!`, 404));
        });
        /** controller config respose error */
        this.app.use(controllerError_1.default);
        /** listen port */
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    });
}
exports.ExpressConfig = ExpressConfig;
