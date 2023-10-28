// * import lib
import express, { Express, NextFunction, Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';

// * import project
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import ExpressCors from '@ecommerce-backend/src/main/config/cors';
import ExpressRoutes from '@ecommerce-backend/src/main/config/routes';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import controllerErrorConfig from '@ecommerce-backend/src/shared/common/controllerError';
import InjectionInit from '@ecommerce-backend/src/main/config/injection';

// ==============================||  EXPRESS CONFIG ||============================== //

export class ExpressConfig {
    private app: Express;
    private port: number;

    /** constructor */
    constructor(express: Express, port: number) {
        this.app = express;
        this.port = port;
    }

    /** define function init */
    public init = catchAsync(async (): Promise<void> => {
        /** json pareser */
        this.app.use(express.json({ limit: '50mb' }));
        /** cors config */
        ExpressCors(this.app);

        /** limiter request from same API */
        // const limiter = rateLimit({
        //     max: 100,
        //     windowMs: 60 * 60 * 1000,
        //     message: 'Too many requests from this IP, please try again in an hour!'
        // });
        // this.app.use('/api', limiter);

        /** injecttion config */
        InjectionInit();

        /** routes config */
        ExpressRoutes(this.app);

        /** check url not support in this server */
        this.app.all('*', (req: Request, res: Response, next: NextFunction) => {
            next(new AppError(`Unsupport path ${req.originalUrl} on this server!`, 404));
        });

        /** controller config respose error */
        this.app.use(controllerErrorConfig);

        /** listen port */
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    });
}
