import express, { NextFunction, Request, Response } from 'express';

import databaseConnection from '@ecommerce-backend/src/infrastructure/config/db.config';
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { ExpressConfig } from '@ecommerce-backend/src/main/config/express';

/** @todo: main function */
const main = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    /** connection database */
    databaseConnection(req, res, next);

    /** create server */
    const PORT: number = Number(process.env.PORT) || 3000;

    /** init app */
    const app = express();
    const Express = new ExpressConfig(app, PORT);
    Express.init(req, res, next);
});

/** run main function */
main();
