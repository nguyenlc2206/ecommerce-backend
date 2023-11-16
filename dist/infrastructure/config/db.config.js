"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// * import lib
const mongoose_1 = __importDefault(require("mongoose"));
// * import porjects
const env_1 = __importDefault(require("../../main/config/env"));
const catchAsync_1 = __importDefault(require("../../shared/common/catchAsync"));
/** @todo: connect to mongo database */
const databaseConnection = (0, catchAsync_1.default)(async () => {
    const connected = await mongoose_1.default.connect(env_1.default.databaseURL, {});
    console.log(`Mongodb connected ${connected.connection.host}`);
    console.log('Connection database successful!');
});
exports.default = databaseConnection;
