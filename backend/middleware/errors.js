// Import error handler class
const ErrorHandler = require('../utilities/errorHandler');

module.exports = (err, req, res, next) => {
    
    err.statusCode = err.statusCode || 500;

    if(process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success:false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }

    if(process.env.NODE_ENV === 'PRODUCTION') {
        res.status(err.statusCode).json({
            errMessage: err.message
        })

        // Wrong Mongoose Object ID Error
        if(err.name === 'CastError') {
            const message = `Resource not found: invalid ${err.path}`
            error = new ErrorHandler(message, 404)
        }

        // Handle Mongoose validation error (for example adding a model instance without name)
        if(err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message)
            error = new ErrorHandler(message, 404)
        }

        // Handle Mongoose duplicate key errors (for example adding a user with same email)
        if(err.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message, 400) 
        }

        // Handle wrong JWT error
        if(err.name === 'JsonWebTokenError') {
            const message = 'JSON Web Token is invalid'
            error = new ErrorHandler(message, 400)
        }

        // Handle expired JWT error
        if(err.name === 'TokenExpiredError') {
            const message = 'JSON Web Token is expired'
            error = new ErrorHandler(message, 400 )
        }

        res.status(error.statusCode).json({
            success:false,
            message: error.message || 'Internal Server Error'
        })
    }
}