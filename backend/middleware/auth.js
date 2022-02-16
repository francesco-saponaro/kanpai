// Import catch async errors class
const catchAsyncErrors = require('./catchAsyncErrors');
// Import error handler class
const ErrorHandler = require('../utilities/errorHandler');
// Import package used to release jwt token
const jwt = require('jsonwebtoken')
// Import user model
const User = require('../models/users')

// Check if user is authenticated
exports.isUserAuthenticated = catchAsyncErrors(async (req, res, next) => {

    // Get token from the cookies, token should have been sent from the 
    // Log in controller (view), if in fact the user logged in.
    const { token } = req.cookies

    // If no token in cookies send error
    if(!token) {
        
        return next(new ErrorHandler('Login to access this page', 401))
    }

    // If token, verify it and store result in a variable,
    // Then find the user by its ID, remember we used the user ID
    // as payload when creating getJwtToken method (see user model).
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)

    next()
})

// Check if user is authorized to access
exports.isUserAuthorized = (...roles) => {

    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role ${req.user.role} is not authorized to access this resource`, 403))
        }
        next()
    }
}