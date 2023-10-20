import { KeyedObject } from '@ecommerce-backend/src/shared/types';

/** @todo: define Token model reponse */
export class TokenModel {
    id?: string;
    userId?: string;
    token?: string;
    createdTime?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
