"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
// * import projects
const catchAsync_1 = __importDefault(require("../../shared/common/catchAsync"));
const cloudinary_1 = require("../../shared/common/cloudinary");
const email_1 = require("../../shared/common/email");
const otp_1 = require("../../shared/common/otp");
// * import controller
const otp_2 = require("../../main/controllers/otp");
const index_1 = require("../../main/controllers/account/index");
const authentication_1 = require("../../main/controllers/authentication");
const category_1 = require("../../main/controllers/category");
const product_1 = require("../../main/controllers/product");
const order_1 = require("../../main/controllers/order");
const coupon_1 = require("../../main/controllers/coupon");
const cart_1 = require("../../main/controllers/cart");
const email_2 = require("../../main/controllers/email");
// * import services
const login_1 = require("../../domain/services/authentication/login");
const create_1 = require("../../domain/services/account/create");
const updateMe_1 = require("../../domain/services/account/updateMe");
const protected_1 = require("../../domain/services/authentication/protected");
const changePassword_1 = require("../../domain/services/authentication/changePassword");
const forgotPassword_1 = require("../../domain/services/authentication/forgotPassword");
const verifyOTP_1 = require("../../domain/services/otp/verifyOTP");
const generateOTP_1 = require("../../domain/services/otp/generateOTP");
const getMe_1 = require("../../domain/services/account/getMe");
const getAll_1 = require("../../domain/services/account/getAll");
const delete_1 = require("../../domain/services/account/delete");
const update_1 = require("../../domain/services/account/update");
const getById_1 = require("../../domain/services/account/getById");
const logout_1 = require("../../domain/services/authentication/logout");
const update_2 = require("../../domain/services/category/update");
const category_2 = require("../../infrastructure/repositories/category");
const delete_2 = require("../../domain/services/category/delete");
const getAll_2 = require("../../domain/services/category/getAll");
const getById_2 = require("../../domain/services/category/getById");
const create_2 = require("../../domain/services/product/create");
const update_3 = require("../../domain/services/product/update");
const delete_3 = require("../../domain/services/product/delete");
const getById_3 = require("../../domain/services/product/getById");
const getAll_3 = require("../../domain/services/product/getAll");
const create_3 = require("../../domain/services/order/create");
const delete_4 = require("../../domain/services/order/delete");
const getAll_4 = require("../../domain/services/order/getAll");
const getById_4 = require("../../domain/services/order/getById");
const create_4 = require("../../domain/services/coupon/create");
const discount_1 = require("../../domain/services/coupon/discount");
const getAll_5 = require("../../domain/services/coupon/getAll");
const delete_5 = require("../../domain/services/coupon/delete");
const getPaginate_1 = require("../../domain/services/order/getPaginate");
const getAllSize_1 = require("../../domain/services/product/getAllSize");
// * import repository
const account_impl_1 = require("../../infrastructure/repositories/account.impl");
const otp_impl_1 = require("../../infrastructure/repositories/otp.impl");
const token_impl_1 = require("../../infrastructure/repositories/token.impl");
const product_impl_1 = require("../../infrastructure/repositories/products/product.impl");
const size_impl_1 = require("../../infrastructure/repositories/products/size.impl");
const order_impl_1 = require("../../infrastructure/repositories/order.impl");
const update_4 = require("../../domain/services/order/update");
const coupon_impl_1 = require("../../infrastructure/repositories/coupon.impl");
const createSize_1 = require("../../domain/services/product/createSize");
const update_5 = require("../../domain/services/coupon/update");
const query_1 = require("../../domain/services/product/query");
const filter_1 = require("../../domain/services/product/filter");
const cart_impl_1 = require("../../infrastructure/repositories/products/cart.impl");
const create_5 = require("../../domain/services/cart/create");
const getByAccountId_1 = require("../../domain/services/cart/getByAccountId");
const update_6 = require("../../domain/services/cart/update");
const delete_6 = require("../../domain/services/cart/delete");
// import payment
const stripe_1 = require("../../domain/services/payment/stripe");
const changePasswordAdmin_1 = require("../../domain/services/authentication/changePasswordAdmin");
const active_1 = require("../../domain/services/account/active");
const active_2 = require("../../domain/services/category/active");
const active_3 = require("../../domain/services/product/active");
const active_4 = require("../../domain/services/coupon/active");
const sort_1 = require("../../domain/services/product/sort");
const getByAccountId_2 = require("../../domain/services/order/getByAccountId");
// ==============================||  INJECTTION INIT ||============================== //
const InjectionInit = (0, catchAsync_1.default)(async () => {
    /** @todo: define store, data */
    // * define store
    typedi_1.Container.set(cloudinary_1.Cloudinary, new cloudinary_1.Cloudinary());
    typedi_1.Container.set(email_1.Email, new email_1.Email());
    typedi_1.Container.set(otp_1.OTPService, new otp_1.OTPService());
    /** @todo: define controller */
    // * define account controller
    typedi_1.Container.set(index_1.AccountController, new index_1.AccountController());
    typedi_1.Container.set(authentication_1.AuthenticationController, new authentication_1.AuthenticationController());
    typedi_1.Container.set(otp_2.OTPController, new otp_2.OTPController());
    typedi_1.Container.set(category_1.CategoryController, new category_1.CategoryController());
    typedi_1.Container.set(product_1.ProductController, new product_1.ProductController());
    typedi_1.Container.set(cart_1.ProductCartController, new cart_1.ProductCartController());
    typedi_1.Container.set(order_1.OrderController, new order_1.OrderController());
    typedi_1.Container.set(coupon_1.CouponController, new coupon_1.CouponController());
    typedi_1.Container.set(email_2.EmailController, new email_2.EmailController());
    /** @todo: define services */
    // * define account services
    typedi_1.Container.set(updateMe_1.UpdateAccountMeServiceImpl, new updateMe_1.UpdateAccountMeServiceImpl());
    typedi_1.Container.set(getMe_1.GetAccountMeServiceImpl, new getMe_1.GetAccountMeServiceImpl());
    typedi_1.Container.set(create_1.CreateAccountServiceImpl, new create_1.CreateAccountServiceImpl());
    typedi_1.Container.set(getAll_1.GetAllAccountServiceImpl, new getAll_1.GetAllAccountServiceImpl());
    typedi_1.Container.set(delete_1.DeleteAccountServiceImpl, new delete_1.DeleteAccountServiceImpl());
    typedi_1.Container.set(update_1.UpdateAccountServiceImpl, new update_1.UpdateAccountServiceImpl());
    typedi_1.Container.set(getById_1.GetAccountByIdServiceImpl, new getById_1.GetAccountByIdServiceImpl());
    typedi_1.Container.set(active_1.ActiveAccountServiceImpl, new active_1.ActiveAccountServiceImpl());
    // * define authentication services
    typedi_1.Container.set(login_1.LoginServiceImpl, new login_1.LoginServiceImpl());
    typedi_1.Container.set(protected_1.ProtectedServiceImpl, new protected_1.ProtectedServiceImpl());
    typedi_1.Container.set(changePassword_1.ChangePasswordServiceImpl, new changePassword_1.ChangePasswordServiceImpl());
    typedi_1.Container.set(changePasswordAdmin_1.ChangePasswordAdminServiceImpl, new changePasswordAdmin_1.ChangePasswordAdminServiceImpl());
    typedi_1.Container.set(forgotPassword_1.ForgotPasswordServiceImpl, new forgotPassword_1.ForgotPasswordServiceImpl());
    typedi_1.Container.set(logout_1.LogoutServiceImpl, new logout_1.LogoutServiceImpl());
    // * define OTP services
    typedi_1.Container.set(verifyOTP_1.VerifyOTPServiceImpl, new verifyOTP_1.VerifyOTPServiceImpl());
    typedi_1.Container.set(generateOTP_1.GenerateOTPServiceImpl, new generateOTP_1.GenerateOTPServiceImpl());
    // * define category services
    typedi_1.Container.set(create_1.CreateAccountServiceImpl, new create_1.CreateAccountServiceImpl());
    typedi_1.Container.set(update_2.UpdateCategoryServiceImpl, new update_2.UpdateCategoryServiceImpl());
    typedi_1.Container.set(delete_2.DeleteCategoryServiceImpl, new delete_2.DeleteCategoryServiceImpl());
    typedi_1.Container.set(getAll_2.GetAllCategoryServiceImpl, new getAll_2.GetAllCategoryServiceImpl());
    typedi_1.Container.set(getById_2.GetCategoryByIdServiceImpl, new getById_2.GetCategoryByIdServiceImpl());
    typedi_1.Container.set(active_2.ActiveCategoryServiceImpl, new active_2.ActiveCategoryServiceImpl());
    // * define product services
    typedi_1.Container.set(create_2.CreateProductServiceImpl, new create_2.CreateProductServiceImpl());
    typedi_1.Container.set(update_3.UpdateProductServiceImpl, new update_3.UpdateProductServiceImpl());
    typedi_1.Container.set(delete_3.DeleteProductServiceImpl, new delete_3.DeleteProductServiceImpl());
    typedi_1.Container.set(getById_3.GetProductByIdServiceImpl, new getById_3.GetProductByIdServiceImpl());
    typedi_1.Container.set(getAll_3.GetAllProductServiceImpl, new getAll_3.GetAllProductServiceImpl());
    typedi_1.Container.set(getAllSize_1.GetAllProductSizeServiceImpl, new getAllSize_1.GetAllProductSizeServiceImpl());
    typedi_1.Container.set(createSize_1.CreateProductSizeServiceImpl, new createSize_1.CreateProductSizeServiceImpl());
    typedi_1.Container.set(query_1.QueryServiceImpl, new query_1.QueryServiceImpl());
    typedi_1.Container.set(filter_1.FilterServiceImpl, new filter_1.FilterServiceImpl());
    typedi_1.Container.set(create_5.CreateProductCartServiceImpl, new create_5.CreateProductCartServiceImpl());
    typedi_1.Container.set(getByAccountId_1.GetProductCartByAccountIdServiceImpl, new getByAccountId_1.GetProductCartByAccountIdServiceImpl());
    typedi_1.Container.set(update_6.UpdateProductCardServiceImpl, new update_6.UpdateProductCardServiceImpl());
    typedi_1.Container.set(delete_6.DeleteProductCartServiceImpl, new delete_6.DeleteProductCartServiceImpl());
    typedi_1.Container.set(active_3.ActiveProductServiceImpl, new active_3.ActiveProductServiceImpl());
    typedi_1.Container.set(sort_1.SortProductServiceImpl, new sort_1.SortProductServiceImpl());
    // * define order services
    typedi_1.Container.set(create_3.CreateOrderServiceImpl, new create_3.CreateOrderServiceImpl());
    typedi_1.Container.set(delete_4.DeleteOrderServiceImpl, new delete_4.DeleteOrderServiceImpl());
    typedi_1.Container.set(getAll_4.GetAllOrderServiceImpl, new getAll_4.GetAllOrderServiceImpl());
    typedi_1.Container.set(getById_4.GetOrderByIdServiceImpl, new getById_4.GetOrderByIdServiceImpl());
    typedi_1.Container.set(update_4.UpdateOrderServiceImpl, new update_4.UpdateOrderServiceImpl());
    typedi_1.Container.set(getPaginate_1.GetPaginateOrderServiceImpl, new getPaginate_1.GetPaginateOrderServiceImpl());
    typedi_1.Container.set(getByAccountId_2.GetOrderByAccountIdServiceImpl, new getByAccountId_2.GetOrderByAccountIdServiceImpl());
    // * define coupon services
    typedi_1.Container.set(create_4.CreateCouponServiceImpl, new create_4.CreateCouponServiceImpl());
    typedi_1.Container.set(discount_1.DiscountServiceImpl, new discount_1.DiscountServiceImpl());
    typedi_1.Container.set(getAll_5.GetAllCouponServiceImpl, new getAll_5.GetAllCouponServiceImpl());
    typedi_1.Container.set(delete_5.DeleteCouponServiceImpl, new delete_5.DeleteCouponServiceImpl());
    typedi_1.Container.set(update_5.UpdateCouponServiceImpl, new update_5.UpdateCouponServiceImpl());
    typedi_1.Container.set(active_4.ActiveCouponServiceImpl, new active_4.ActiveCouponServiceImpl());
    /** @todo: define store, repository */
    // * define account repository
    typedi_1.Container.set(account_impl_1.AccountRepositoryImpl, new account_impl_1.AccountRepositoryImpl());
    typedi_1.Container.set(otp_impl_1.OTPRepositoryImpl, new otp_impl_1.OTPRepositoryImpl());
    typedi_1.Container.set(token_impl_1.TokenRepositoryImpl, new token_impl_1.TokenRepositoryImpl());
    typedi_1.Container.set(category_2.CategoryRepositoryImpl, new category_2.CategoryRepositoryImpl());
    typedi_1.Container.set(order_impl_1.OrderRepositoryImpl, new order_impl_1.OrderRepositoryImpl());
    typedi_1.Container.set(coupon_impl_1.CouponRepositoryImpl, new coupon_impl_1.CouponRepositoryImpl());
    // * products repository
    typedi_1.Container.set(product_impl_1.ProductRepositoryImpl, new product_impl_1.ProductRepositoryImpl());
    typedi_1.Container.set(size_impl_1.ProductSizeRepositoryImpl, new size_impl_1.ProductSizeRepositoryImpl());
    typedi_1.Container.set(cart_impl_1.ProductCartRepositoryImpl, new cart_impl_1.ProductCartRepositoryImpl());
    // * payment
    typedi_1.Container.set(stripe_1.PaymentStripeServiceImpl, new stripe_1.PaymentStripeServiceImpl());
});
exports.default = InjectionInit;
