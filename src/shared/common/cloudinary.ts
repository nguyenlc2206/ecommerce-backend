// * import lib
import { Service } from 'typedi';
import { v2 as cloudinary } from 'cloudinary';

// * import projects
import ENV from '@ecommerce-backend/src/main/config/env';
import { CloudinaryMethods } from '@ecommerce-backend/src/shared/methods/cloudinary';
import { KeyedObject } from '@ecommerce-backend/src/shared/types';

/** @todo: config cloudinary imamge/video */
cloudinary.config({
    cloud_name: ENV.cloudinaryName,
    api_key: ENV.cloudinaryKey,
    api_secret: ENV.cloudinarySecret,
    secure: true
});

@Service()
export class Cloudinary<T extends KeyedObject> implements CloudinaryMethods<T> {
    /** constructor */
    constructor() {}

    /** overiding uploadImage method */
    async uploadImage(entity: T): Promise<T> {
        const response: any = await cloudinary.uploader.upload(entity?.database64, {
            folder: entity?.package,
            public_id: entity?.publicId,
            overwrite: true,
            unique_filename: false
        });
        return response;
    }

    /** overiding getImageById method */
    async getImageById(id: string): Promise<void> {
        try {
            // Get details about the asset
            const response = await cloudinary.api.resource(id);
            return response;
        } catch (error) {
            console.error(error);
        }
    }
}
