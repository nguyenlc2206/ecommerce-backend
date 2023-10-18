import cors from 'cors';
import { Express, NextFunction, Request, Response } from 'express';

// ==============================||  EXPRESS CORS ||============================== //

const ExpressCors = (app: Express) => {
    app.use(cors({ origin: '*' }));
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.setHeader('access-control-allow-methods', '*');
        res.setHeader('access-control-allow-headers', '*');
        res.setHeader('x-powered-by', '*');
        next();
    });
};

export default ExpressCors;
