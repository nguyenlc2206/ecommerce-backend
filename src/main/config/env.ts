import * as dotenv from 'dotenv';

/** init dotenv */
dotenv.config();

const { env } = process;

// * define ENV
const ENV = {
    portDB: env.PORT_DB || 5432,
    usernameDB: env.NODE_ENV === 'production' ? env.USER || '' : env.USER_ENV,
    databaseURL: env.NODE_ENV === 'production' ? env.DATABASE || '' : env.DATABASE_ENV,
    bcryptSalt: Number(env.BCRYPT_SALT) || 12,
    jwtSecret: env.JWT_SECRET || 'any_secret_1tJK==__02&sdA',
    expiresIn: env.JWT_EXPIRES_IN || '1h',
    cloudinaryName: env.CLOUDINARY_NAME || '',
    cloudinaryKey: env.CLOUDINARY_KEY || '',
    cloudinarySecret: env.CLOUDINARY_SECRET || '',
    emailUsername: env.EMAIL_USERNAME || '',
    emailPassword: env.EMAIL_PASSWORD || '',
    emailHost: env.EMAIL_HOST || undefined,
    emailPort: Number(env.EMAIL_PORT) || 0,
    emailFrom: env.EMAIL_FROM || '',
    stripeSecretKey: env.STRIPE_SECRET_KEY || '',
    paypalSecret: env.PAYPAL_API_SECRET || '',
    paypalclient: env.PAYPAL_API_CLIENT || '',
    paypalApi: env.PAYPA_API || '',
    host: env.NODE_ENV === 'production' ? env.HOST : 'http://localhost:8080'
};

export default ENV;
