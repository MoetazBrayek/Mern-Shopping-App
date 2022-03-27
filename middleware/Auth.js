import {asyncHandler} from '../utilis/async.js';
import {createError} from '../utilis/createError.js';
import jwt from'jsonwebtoken';
import {User} from '../models/User.js'


const verifyToken = (token, secret) => {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      if (error.name === "TokenExpiredError")
        throw createError(401, "Token is expired. Please Login");
      throw error;
    }
  };
export const protect = asyncHandler(async (req, res, next) => {
    const authorization = req.headers["authorization"];
    if (!(authorization && authorization.toLowerCase().startsWith("bearer")))
      throw createError(401, "Not authorized for this action");
    //Or check for cookie...
  
    const token = authorization.split(" ")[1];
  
    const decodeToken = verifyToken(token, process.env.JWT_SECRET);
  
    req.user = await User.findById(decodeToken._id);
  
    next();
  });
  