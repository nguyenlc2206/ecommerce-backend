import { Request } from 'express';
import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';

/** common types */
export type KeyedObject = {
    [key: string]: string | number | KeyedObject | void | any;
};

//* define response error type
export type ControllerError = {
    statusCode: number;
    status: string;
    message: string;
    stack: any;
    isOperational: boolean;
    name: string;
};

/* Define DecodeAccountTokenType model*/
export type DecodeAccountTokenType = {
    key: string;
    iat: number;
    exp?: number;
};

// * define type params image
export type ParamsImageType = {
    database64?: string;
    package?: string;
    publicId?: string | undefined;
};

/** Define userInfor */
export interface AccountRequest extends Request {
    userId?: string;
    email?: string;
    role?: string;
    password?: string;
    account?: AccountModel;
}

export type RolesType = {
    [index: number]: string;
};
