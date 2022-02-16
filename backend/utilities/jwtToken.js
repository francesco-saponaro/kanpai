// Create and send token and save it in the cookie
const sendToken = (user, statusCode, res) => {

    // Create jwt token with the method defined in the user model
    // and store it in variable to be passed in the front end.
    const token = user.getJwtToken();

    // Options for cookie
    const options = {
        
        expires: new Date(
            // Convert time into milliseconds
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        // Must specify that the cookie is httpOnly or it wont be safe
        httpOnly: true
    }

    // Save the token in the cookie and return the response
    res.status(statusCode).cookie('token', token, options).json({
        success:true,
        token,
        user
    })
}

module.exports = sendToken;