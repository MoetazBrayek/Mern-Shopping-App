import {Register,Login,UpdateDetails,UpdatePassword,ForgotPassword,ResetPassword} from '../controllers/AuthController.js';
import {CreateProduct , GetProducts , GetProduct, RemoveProduct, UpdateProduct } from '../controllers/ProductController.js';
import express from 'express';
const router = express.Router();
router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/update/userDetails").put(UpdateDetails);
router.route("/update/password").put(UpdatePassword);
router.route("/forgotPassword").post(ForgotPassword);
router.route("/resetPassword").post(ResetPassword);
router.route("/product").post(CreateProduct);
router.route("/product").get(GetProducts);
router.route("/product/:productId").get(GetProduct);
router.route("/product/:productId").delete(RemoveProduct);
router.route("/product/:productId").put(UpdateProduct);

export default router;
