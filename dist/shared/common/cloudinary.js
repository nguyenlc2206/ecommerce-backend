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
exports.Cloudinary = void 0;
// * import lib
const typedi_1 = require("typedi");
const cloudinary_1 = require("cloudinary");
// * import projects
const env_1 = __importDefault(require("../../main/config/env"));
/** @todo: config cloudinary imamge/video */
cloudinary_1.v2.config({
    cloud_name: env_1.default.cloudinaryName,
    api_key: env_1.default.cloudinaryKey,
    api_secret: env_1.default.cloudinarySecret,
    secure: true
});
let Cloudinary = class Cloudinary {
    /** constructor */
    constructor() { }
    /** overiding uploadImage method */
    async uploadImage(entity) {
        const response = await cloudinary_1.v2.uploader.upload(entity?.database64, {
            folder: entity?.package,
            public_id: entity?.publicId,
            overwrite: true,
            unique_filename: false
        });
        return response;
    }
    /** overiding getImageById method */
    async getImageById(id) {
        try {
            // Get details about the asset
            const response = await cloudinary_1.v2.api.resource(id);
            return response;
        }
        catch (error) {
            console.error(error);
        }
    }
};
exports.Cloudinary = Cloudinary;
exports.Cloudinary = Cloudinary = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], Cloudinary);
