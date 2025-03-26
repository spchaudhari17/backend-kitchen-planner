const User = require('../models/user/User')
const { CustomError } = require('./errorHandler')

const requireRoles = (Roles) => {
    return (req, res, next) => {
        console.log("User Object in requireRoles:", req.user);

        // If "Guest" is an allowed role and user is unauthenticated
        if (!req.user && Roles.includes("Guest")) {
            return next(); // Allow access for Guests
        }

        // Check if authenticated user's roles match the allowed roles
        const checkRoles = req.roles && req.roles.find(role => Roles.includes(role));
        if (!checkRoles) throw new CustomError('Unauthorized Roles', 401);

        next();
    };
};

module.exports = requireRoles;