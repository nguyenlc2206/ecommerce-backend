"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_config_1 = __importDefault(require("../infrastructure/config/db.config"));
const catchAsync_1 = __importDefault(require("../shared/common/catchAsync"));
const express_2 = require("../main/config/express");
/** @todo: main function */
const main = (0, catchAsync_1.default)(async (req, res, next) => {
    /** connection database */
    (0, db_config_1.default)(req, res, next);
    /** create server */
    const PORT = Number(process.env.PORT) || 3000;
    /** init app */
    const app = (0, express_1.default)();
    const Express = new express_2.ExpressConfig(app, PORT);
    Express.init(req, res, next);
});
/** run main function */
main();
