import {Register,Login,UpdateDetails,UpdatePassword,ForgotPassword,ResetPassword} from '../controllers/AuthController.js';
import {CreateProduct , GetProducts , GetProduct, RemoveProduct, UpdateProduct } from '../controllers/ProductController.js';
import {UpdateShippingAddress } from '../controllers/OrderController.js';
import {protect} from '../middleware/Auth.js'

import express from 'express';
const router = express.Router();
router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/update/userDetails").put(UpdateDetails);
router.route("/update/password").put(UpdatePassword);
router.route("/forgotPassword").post(ForgotPassword);
router.route("/resetPassword").post(ResetPassword);
router.route("/product").post(protect ,CreateProduct);
router.route("/product").get(protect ,GetProducts);
router.route("/product/:productId").get(protect ,GetProduct);
router.route("/product/:productId").delete(protect ,RemoveProduct);
router.route("/product/:productId").put(protect ,UpdateProduct);
router.route("/shipping").put(protect ,UpdateShippingAddress);

export default router;
