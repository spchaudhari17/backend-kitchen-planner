const jwt = require('jsonwebtoken');
const User = require('../models/user/User');
const { CustomError } = require('./errorHandler');

const requireAuth = async (req, res, next) => {
  try {
    // Extract authorization header
    const { authorization } = req.headers;

    // Check if the authorization header is present and correctly formatted
    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.error("Authorization header is missing or invalid.");
      throw new CustomError('Request is not authorized', 401);
    }

    // Extract token from the authorization header
    const accessToken = authorization.split(' ')[1];
    console.log("Extracted Access Token:", accessToken);

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      console.log("Decoded Token:", decoded);
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        console.error("Token expired.");
        throw new CustomError('Forbidden: token expired', 403);
      } else if (jwtError instanceof jwt.JsonWebTokenError) {
        console.error("Token is invalid.");
        throw new CustomError('Invalid token', 403);
      } else {
        console.error("Token verification failed.");
        throw new CustomError('Token verification failed', 403);
      }
    }

    // Fetch the user from the database
    const user = await User.findById(decoded.userInfo._id)
      .select('_id active roles')
      .lean()
      .exec();

    console.log("User Found in Database:", user);

    if (!user) {
      console.error("User not found in the database.");
      throw new CustomError('Unauthorized: user not found', 401);
    }

    // Check if the user is active
    if (!user.active) {
      console.warn("User account is inactive. Clearing cookies.");
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'Lax', secure: true });
      throw new CustomError('Your account has been blocked', 400);
    }

    // Attach user details to the request object
    req.user = user._id;
    req.roles = user.roles;

    console.log("User ID set in request:", req.user);
    console.log("User roles set in request:", req.roles);

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error in requireAuth Middleware:", error);
    next(error);
  }
};

module.exports = requireAuth;
