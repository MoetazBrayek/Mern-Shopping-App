import jwt from 'jsonwebtoken';

/**
 * Decodes the payload of a JWT
 * @param {string} token The JWT token to decode
 */
 export function extractPayload(token){
    token = jwt.verify(token,`${process.env.JWT_SECRET}`);
    return token;
}
export var currentUserId = (req) =>
  extractPayload(req.headers.authorization.split('Bearer ')[1])._id;
export var currentUserEmail = (req) =>
  extractPayload(req.headers.authorization.split('Bearer ')[1]).email;

