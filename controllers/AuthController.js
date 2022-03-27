import bcrypt from'bcrypt';
import jwt from'jsonwebtoken';
import crypto from 'crypto';
import {asyncHandler} from'../utilis/async.js';
import {createError} from'../utilis/createError.js';
import {User} from'../models/User.js';


/**
 * This Function To Try The Register
 * @param {Object} req The object that represents the http call that called the api endpoint
 * @param {Object} res The object that represents the response to the http call
 */
export const Register = asyncHandler(async (req, res, next) => {
    try {
        await User.create({ ...req.body});    
        res.status(200).send({
            status: "success",
            message: "User has been created",
        });
    } catch (error) {
        throw createError(500, "SOmething Wen Wrong");
    }

});


export const genAuthToken = function (userId) {
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIREIN,
    });
};

export const matchPassword = async function (enteredPassword, RealPassword) {
    return await bcrypt.compare(enteredPassword, RealPassword);
};

export const getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

/**
 * This Function To Try The Login
 * @param {Object} req The object that represents the http call that called the api endpoint
 * @param {Object} res The object that represents the response to the http call
 */
 export const Login = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email,
        verify: true,
        actif: true,
    }).select("+password");
    if (!user) throw createError(401, `Email doesn't match`);
    const isPassword = await matchPassword(req.body.password, user.password);
    if (!isPassword) throw createError(401, `Password doesn't match`);

    sendTokenResponse(user, 200, res);
});

/**
 * This Function To Try To Update The User Name / email
 * @param {Object} req The object that represents the http call that called the api endpoint
 * @param {Object} res The object that represents the response to the http call
 */
export const UpdateDetails = asyncHandler(async (req, res, next) => {
    const newDetails = {
        name: req.body.name,
        email: req.body.email,
    };
    await User.findByIdAndUpdate(req.user._id, newDetails, {
        new: true,
        runValidators: true,
    });

    const updateDetails = await User.findById(req.user._id);
    res.status(200).send({ status: "success", data: updateDetails });
});

/**
 * This Function To Try To Update The User Name / email
 * @param {Object} req The object that represents the http call that called the api endpoint
 * @param {Object} res The object that represents the response to the http call
 */
export const UpdatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch)
        throw createError(
            400,
            `Current password ${req.body.currentPassword} does't match`
        );

    user.password = req.body.newPassword;

    await user.save();

    sendTokenResponse(user, 200, res);
});

//Forgot Password

export const ForgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
        throw createError(400, `User with email ${req.body.email} is not found`);

    const resetToken = getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    try {
        const resetUrl = `http://localhost:5000/resetPassword/?token=${resetToken}`;

        const message = `You are receiving this email because you (or someone else ) has
    requested the reset of a password.`;

        const options = {
            email: user.email,
            subject: "Password reset token",
            message,
            url: resetUrl,
        };

        //await sendEmail(options);

        res
            .status(200)
            .send({ status: "success", message: "ResetPassword token Email sent" });
    } catch (error) {
        console.log(error);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        throw createError(500, "Email cound't be sent");
    }
});

//ResetPassword

export const ResetPassword = asyncHandler(async (req, res, next) => {
    //Hash the resetToken

    const resetToken = crypto
        .createHash("sha256")
        .update(req.body.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) throw createError(400, `Invalid token ${req.body.token}`);

    user.password = req.body.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res
        .status(200)
        .send({ status: "success", message: "Your Password has beed changed" });
});

export const sendTokenResponse = (user, statusCode, res) => {
    const token = genAuthToken(user.id);
    const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verify: user.verify,
    };

    res.status(statusCode).send({ status: "success", token, authData: userData });
};

