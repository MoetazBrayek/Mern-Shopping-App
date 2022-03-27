import {asyncHandler} from'../utilis/async.js';
import {createError} from'../utilis/createError.js';
import {Shipping} from'../models/Order.js';
import {currentUserEmail, currentUserId} from './JWTController.js'


/**
 * This Function To Try The Register
 * @param {Object} req The object that represents the http call that called the api endpoint
 * @param {Object} res The object that represents the response to the http call
 */
 export const UpdateShippingAddress = asyncHandler(async (req, res, next) => {
    try {
        const SHopaddress = {
        address: req.body.address,
        city: req.body.city,
        postalCode: req.body.postalCode,
        country: req.body.country,
        userId: currentUserId(req)
        };
        const OldShopAddress = Shipping.findOne({userId : SHopaddress.userId})
        if(OldShopAddress){
            await Shipping.updateOne(OldShopAddress , SHopaddress);    
            res.status(200).send({
                status: "success",
                message: "User Shipping Address Has been Updated",
            });        
        }else{
            console.log("not here yet")
        }
       
    } catch (error) {
        console.log(error.message)
        throw createError(500, "SOmething Wen Wrong");
    }

});
