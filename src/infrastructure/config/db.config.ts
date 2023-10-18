// * import lib
import mongoose from 'mongoose';

// * import porjects
import ENV from '@ecommerce-backend/src/main/config/env';
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';

const DB_URL = ENV.databaseURL!.replace('<PASSWORD>', ENV.databasePassword!);

/** @todo: connect to mongo database */
const databaseConnection = catchAsync(async () => {
    const connected = await mongoose.connect(DB_URL, {});
    console.log(`Mongodb connected ${connected.connection.host}`);
    console.log('Connection database successful!');
});

export default databaseConnection;
