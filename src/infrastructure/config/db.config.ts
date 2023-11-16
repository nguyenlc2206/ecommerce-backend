// * import lib
import mongoose from 'mongoose';

// * import porjects
import ENV from '@ecommerce-backend/src/main/config/env';
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';

/** @todo: connect to mongo database */
const databaseConnection = catchAsync(async () => {
    const connected = await mongoose.connect(ENV.databaseURL!, {});
    console.log(`Mongodb connected ${connected.connection.host}`);
    console.log('Connection database successful!');
});

export default databaseConnection;
