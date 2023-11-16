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
import { CategoryController } from '@ecommerce-backend/src/main/controllers/category';
import { ProductController } from '@ecommerce-backend/src/main/controllers/product';
import { OrderController } from '@ecommerce-backend/src/main/controllers/order';
import { CouponController } from '@ecommerce-backend/src/main/controllers/coupon';
import { ProductCartController } from '@ecommerce-backend/src/main/controllers/cart';

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

import { UpdateCategoryServiceImpl } from '@ecommerce-backend/src/domain/services/category/update';
import { CategoryRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/category';
import { DeleteCategoryServiceImpl } from '@ecommerce-backend/src/domain/services/category/delete';
import { GetAllCategoryServiceImpl } from '@ecommerce-backend/src/domain/services/category/getAll';
import { GetCategoryByIdServiceImpl } from '@ecommerce-backend/src/domain/services/category/getById';

import { CreateProductServiceImpl } from '@ecommerce-backend/src/domain/services/product/create';
import { UpdateProductServiceImpl } from '@ecommerce-backend/src/domain/services/product/update';
import { DeleteProductServiceImpl } from '@ecommerce-backend/src/domain/services/product/delete';
import { GetProductByIdServiceImpl } from '@ecommerce-backend/src/domain/services/product/getById';
import { GetAllProductServiceImpl } from '@ecommerce-backend/src/domain/services/product/getAll';
import { CreateOrderServiceImpl } from '@ecommerce-backend/src/domain/services/order/create';
import { DeleteOrderServiceImpl } from '@ecommerce-backend/src/domain/services/order/delete';
import { GetAllOrderServiceImpl } from '@ecommerce-backend/src/domain/services/order/getAll';
import { GetOrderByIdServiceImpl } from '@ecommerce-backend/src/domain/services/order/getById';
import { CreateCouponServiceImpl } from '@ecommerce-backend/src/domain/services/coupon/create';
import { DiscountServiceImpl } from '@ecommerce-backend/src/domain/services/coupon/discount';
import { GetAllCouponServiceImpl } from '@ecommerce-backend/src/domain/services/coupon/getAll';
import { DeleteCouponServiceImpl } from '@ecommerce-backend/src/domain/services/coupon/delete';
import { GetPaginateOrderServiceImpl } from '@ecommerce-backend/src/domain/services/order/getPaginate';
import { GetAllProductSizeServiceImpl } from '@ecommerce-backend/src/domain/services/product/getAllSize';

// * import repository
import { AccountRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/account.impl';
import { OTPRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/otp.impl';
import { TokenRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/token.impl';
import { ProductRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/product.impl';
import { ProductSizeRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/size.impl';
import { OrderRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/order.impl';
import { UpdateOrderServiceImpl } from '@ecommerce-backend/src/domain/services/order/update';
import { CouponRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/coupon.impl';
import { CreateProductSizeServiceImpl } from '@ecommerce-backend/src/domain/services/product/createSize';
import { UpdateCouponServiceImpl } from '@ecommerce-backend/src/domain/services/coupon/update';
import { QueryServiceImpl } from '@ecommerce-backend/src/domain/services/product/query';
import { FilterServiceImpl } from '@ecommerce-backend/src/domain/services/product/filter';
import { ProductCartRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/cart.impl';
import { CreateProductCartServiceImpl } from '@ecommerce-backend/src/domain/services/cart/create';
import { GetProductCartByAccountIdServiceImpl } from '@ecommerce-backend/src/domain/services/cart/getByAccountId';
import { UpdateProductCardServiceImpl } from '@ecommerce-backend/src/domain/services/cart/update';
import { DeleteProductCartServiceImpl } from '@ecommerce-backend/src/domain/services/cart/delete';

// import payment
import { PaymentStripeServiceImpl } from '@ecommerce-backend/src/domain/services/payment/stripe';
import { ChangePasswordAdminServiceImpl } from '@ecommerce-backend/src/domain/services/authentication/changePasswordAdmin';
import { ActiveAccountServiceImpl } from '@ecommerce-backend/src/domain/services/account/active';
import { ActiveCategoryServiceImpl } from '@ecommerce-backend/src/domain/services/category/active';
import { ActiveProductServiceImpl } from '@ecommerce-backend/src/domain/services/product/active';
import { ActiveCouponServiceImpl } from '@ecommerce-backend/src/domain/services/coupon/active';
import { SortProductServiceImpl } from '@ecommerce-backend/src/domain/services/product/sort';

// ==============================||  INJECTTION INIT ||============================== //

const InjectionInit = catchAsync(async () => {
    /** @todo: define store, data */
    // * define store
    Container.set(Cloudinary, new Cloudinary());
    Container.set(Email, new Email());
    Container.set(OTPService, new OTPService());

    /** @todo: define controller */
    // * define account controller
    Container.set(AccountController, new AccountController());
    Container.set(AuthenticationController, new AuthenticationController());
    Container.set(OTPController, new OTPController());
    Container.set(CategoryController, new CategoryController());
    Container.set(ProductController, new ProductController());
    Container.set(ProductCartController, new ProductCartController());
    Container.set(OrderController, new OrderController());
    Container.set(CouponController, new CouponController());

    /** @todo: define services */
    // * define account services
    Container.set(UpdateAccountMeServiceImpl, new UpdateAccountMeServiceImpl());
    Container.set(GetAccountMeServiceImpl, new GetAccountMeServiceImpl());

    Container.set(CreateAccountServiceImpl, new CreateAccountServiceImpl());
    Container.set(GetAllAccountServiceImpl, new GetAllAccountServiceImpl());
    Container.set(DeleteAccountServiceImpl, new DeleteAccountServiceImpl());
    Container.set(UpdateAccountServiceImpl, new UpdateAccountServiceImpl());
    Container.set(GetAccountByIdServiceImpl, new GetAccountByIdServiceImpl());
    Container.set(ActiveAccountServiceImpl, new ActiveAccountServiceImpl());

    // * define authentication services
    Container.set(LoginServiceImpl, new LoginServiceImpl());
    Container.set(ProtectedServiceImpl, new ProtectedServiceImpl());
    Container.set(ChangePasswordServiceImpl, new ChangePasswordServiceImpl());
    Container.set(ChangePasswordAdminServiceImpl, new ChangePasswordAdminServiceImpl());
    Container.set(ForgotPasswordServiceImpl, new ForgotPasswordServiceImpl());
    Container.set(LogoutServiceImpl, new LogoutServiceImpl());

    // * define OTP services
    Container.set(VerifyOTPServiceImpl, new VerifyOTPServiceImpl());
    Container.set(GenerateOTPServiceImpl, new GenerateOTPServiceImpl());

    // * define category services
    Container.set(CreateAccountServiceImpl, new CreateAccountServiceImpl());
    Container.set(UpdateCategoryServiceImpl, new UpdateCategoryServiceImpl());
    Container.set(DeleteCategoryServiceImpl, new DeleteCategoryServiceImpl());
    Container.set(GetAllCategoryServiceImpl, new GetAllCategoryServiceImpl());
    Container.set(GetCategoryByIdServiceImpl, new GetCategoryByIdServiceImpl());
    Container.set(ActiveCategoryServiceImpl, new ActiveCategoryServiceImpl());

    // * define product services
    Container.set(CreateProductServiceImpl, new CreateProductServiceImpl());
    Container.set(UpdateProductServiceImpl, new UpdateProductServiceImpl());
    Container.set(DeleteProductServiceImpl, new DeleteProductServiceImpl());
    Container.set(GetProductByIdServiceImpl, new GetProductByIdServiceImpl());
    Container.set(GetAllProductServiceImpl, new GetAllProductServiceImpl());
    Container.set(GetAllProductSizeServiceImpl, new GetAllProductSizeServiceImpl());
    Container.set(CreateProductSizeServiceImpl, new CreateProductSizeServiceImpl());
    Container.set(QueryServiceImpl, new QueryServiceImpl());
    Container.set(FilterServiceImpl, new FilterServiceImpl());
    Container.set(CreateProductCartServiceImpl, new CreateProductCartServiceImpl());
    Container.set(GetProductCartByAccountIdServiceImpl, new GetProductCartByAccountIdServiceImpl());
    Container.set(UpdateProductCardServiceImpl, new UpdateProductCardServiceImpl());
    Container.set(DeleteProductCartServiceImpl, new DeleteProductCartServiceImpl());
    Container.set(ActiveProductServiceImpl, new ActiveProductServiceImpl());
    Container.set(SortProductServiceImpl, new SortProductServiceImpl());

    // * define order services
    Container.set(CreateOrderServiceImpl, new CreateOrderServiceImpl());
    Container.set(DeleteOrderServiceImpl, new DeleteOrderServiceImpl());
    Container.set(GetAllOrderServiceImpl, new GetAllOrderServiceImpl());
    Container.set(GetOrderByIdServiceImpl, new GetOrderByIdServiceImpl());
    Container.set(UpdateOrderServiceImpl, new UpdateOrderServiceImpl());
    Container.set(GetPaginateOrderServiceImpl, new GetPaginateOrderServiceImpl());

    // * define coupon services
    Container.set(CreateCouponServiceImpl, new CreateCouponServiceImpl());
    Container.set(DiscountServiceImpl, new DiscountServiceImpl());
    Container.set(GetAllCouponServiceImpl, new GetAllCouponServiceImpl());
    Container.set(DeleteCouponServiceImpl, new DeleteCouponServiceImpl());
    Container.set(UpdateCouponServiceImpl, new UpdateCouponServiceImpl());
    Container.set(ActiveCouponServiceImpl, new ActiveCouponServiceImpl());

    /** @todo: define store, repository */
    // * define account repository
    Container.set(AccountRepositoryImpl, new AccountRepositoryImpl());
    Container.set(OTPRepositoryImpl, new OTPRepositoryImpl());
    Container.set(TokenRepositoryImpl, new TokenRepositoryImpl());
    Container.set(CategoryRepositoryImpl, new CategoryRepositoryImpl());
    Container.set(OrderRepositoryImpl, new OrderRepositoryImpl());
    Container.set(CouponRepositoryImpl, new CouponRepositoryImpl());

    // * products repository
    Container.set(ProductRepositoryImpl, new ProductRepositoryImpl());
    Container.set(ProductSizeRepositoryImpl, new ProductSizeRepositoryImpl());
    Container.set(ProductCartRepositoryImpl, new ProductCartRepositoryImpl());

    // * payment
    Container.set(PaymentStripeServiceImpl, new PaymentStripeServiceImpl());
});

export default InjectionInit;
