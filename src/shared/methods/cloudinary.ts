/** @todo: define methods functions */
export interface CloudinaryMethods<Entity> {
    uploadImage(entity: Entity): Promise<Entity>;
    getImageById(id: string): Promise<void>;
}
