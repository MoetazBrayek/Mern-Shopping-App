import {asyncHandler} from'../utilis/async.js';
import {createError} from'../utilis/createError.js';
import {Shipping} from'../models/Order.js';


/**
 * This Function To Try The Register
 * @param {Object} req The object that represents the http call that called the api endpoint
 * @param {Object} res The object that represents the response to the http call
 */
 export const UpdateShippingAddress = asyncHandler(async (req, res, next) => {
    try {
        await Shipping.create({ ...req.body});    
        res.status(200).send({
            status: "success",
            message: "User Shipping Address Has been Updated",
        });
    } catch (error) {
        throw createError(500, "SOmething Wen Wrong");
    }

});
