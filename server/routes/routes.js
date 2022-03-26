const {
    Register,
    Login,
    UpdateDetails,
    UpdatePassword,
    ForgotPassword,
    ResetPassword,
    VerificationEmail,
} = require("../controllers/AuthController");
const router = require("express").Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/update/userDetails").put(UpdateDetails);
router.route("/update/password").put(UpdatePassword);
router.route("/forgotPassword").post(ForgotPassword);
router.route("/resetPassword").post(ResetPassword);
router.route("/verifyEmail").post(VerificationEmail);

module.exports = router;
