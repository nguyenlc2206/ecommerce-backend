// * import libs
import 'reflect-metadata';
import { Container } from 'typedi';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';

import { Cloudinary } from '@ecommerce-backend/src/shared/common/cloudinary';
import { Email } from '@ecommerce-backend/src/shared/common/email';
import { OTPService } from '@ecommerce-backend/src/shared/common/otp';

// * import controller
import { OTPController } from '@ecommerce-backend/src/main/controllers/otp';
import { AccountController } from '@ecommerce-backend/src/main/controllers/account/index';
import { AuthenticationController } from '@ecommerce-backend/src/main/controllers/authentication';

// * import services
import { LoginServiceImpl } from '@ecommerce-backend/src/domain/services/authentication/login';
import { CreateAccountServiceImpl } from '@ecommerce-backend/src/domain/services/account/create';
import { UpdateAccountMeServiceImpl } from '@ecommerce-backend/src/domain/services/account/updateMe';
import { ProtectedServiceImpl } from '@ecommerce-backend/src/domain/services/authentication/protected';
import { ChangePasswordServiceImpl } from '@ecommerce-backend/src/domain/services/authentication/changePassword';
import { ForgotPasswordServiceImpl } from '@ecommerce-backend/src/domain/services/authentication/forgotPassword';
import { VerifyOTPServiceImpl } from '@ecommerce-backend/src/domain/services/otp/verifyOTP';
import { GenerateOTPServiceImpl } from '@ecommerce-backend/src/domain/services/otp/generateOTP';
import { GetAccountMeServiceImpl } from '@ecommerce-backend/src/domain/services/account/getMe';
import { GetAllAccountServiceImpl } from '@ecommerce-backend/src/domain/services/account/getAll';
import { DeleteAccountServiceImpl } from '@ecommerce-backend/src/domain/services/account/delete';
import { UpdateAccountServiceImpl } from '@ecommerce-backend/src/domain/services/account/update';
import { GetAccountByIdServiceImpl } from '@ecommerce-backend/src/domain/services/account/getById';
import { LogoutServiceImpl } from '@ecommerce-backend/src/domain/services/authentication/logout';

// * import repository
import { AccountRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/account.impl';
import { OTPRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/otp.impl';
import { TokenRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/token.impl';

// ==============================||  INJECTTION INIT ||============================== //

const InjectionInit = catchAsync(async () => {
    // * define store
    Container.set(Cloudinary, new Cloudinary());
    Container.set(Email, new Email());
    Container.set(OTPService, new OTPService());

    // * define account controller
    Container.set(AccountController, new AccountController());
    Container.set(AuthenticationController, new AuthenticationController());
    Container.set(OTPController, new OTPController());

    // * define account services
    Container.set(UpdateAccountMeServiceImpl, new UpdateAccountMeServiceImpl());
    Container.set(GetAccountMeServiceImpl, new GetAccountMeServiceImpl());

    Container.set(CreateAccountServiceImpl, new CreateAccountServiceImpl());
    Container.set(GetAllAccountServiceImpl, new GetAllAccountServiceImpl());
    Container.set(DeleteAccountServiceImpl, new DeleteAccountServiceImpl());
    Container.set(UpdateAccountServiceImpl, new UpdateAccountServiceImpl());
    Container.set(GetAccountByIdServiceImpl, new GetAccountByIdServiceImpl());

    // * define authentication services
    Container.set(LoginServiceImpl, new LoginServiceImpl());
    Container.set(ProtectedServiceImpl, new ProtectedServiceImpl());
    Container.set(ChangePasswordServiceImpl, new ChangePasswordServiceImpl());
    Container.set(ForgotPasswordServiceImpl, new ForgotPasswordServiceImpl());
    Container.set(LogoutServiceImpl, new LogoutServiceImpl());

    // * define OTP services
    Container.set(VerifyOTPServiceImpl, new VerifyOTPServiceImpl());
    Container.set(GenerateOTPServiceImpl, new GenerateOTPServiceImpl());

    // * define account repository
    Container.set(AccountRepositoryImpl, new AccountRepositoryImpl());
    Container.set(OTPRepositoryImpl, new OTPRepositoryImpl());
    Container.set(TokenRepositoryImpl, new TokenRepositoryImpl());
});

export default InjectionInit;
