import {Register,Login,UpdateDetails,UpdatePassword,ForgotPassword,ResetPassword} from '../controllers/AuthController.js';
import {createProduct } from '../controllers/ProductController.js';
import express from 'express';
const router = express.Router();
router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/update/userDetails").put(UpdateDetails);
router.route("/update/password").put(UpdatePassword);
router.route("/forgotPassword").post(ForgotPassword);
router.route("/resetPassword").post(ResetPassword);
router.route("/product").post(createProduct);

export default router;
