// Import user model
const User = require('../models/users')
// Import error handler class
const ErrorHandler = require('../utilities/errorHandler')
// Import catch async errors class
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
// Import send token function from utilities to create and send token and save it in the cookie
const sendToken = require('../utilities/jwtToken');
// Import sendEmail function from utilities to send recovery password email
const sendEmail = require('../utilities/sendEmail');
// Import crypto package used to reset password
// This package is included no need to install it
const crypto = require('crypto')
// Import cloudinary, the package required to manage our images
const cloudinary = require('cloudinary')

// Create new user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password } = req.body;

    // Check if email, email and password pass criterias
    // If not send Internal server error (500)
    if(await User.findOne({ email })){
        return next(new ErrorHandler('This email is already registered', 500))
    }

    // Upload selected avatar image to your cloudinary avatar folder
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: 'scale'
    })

    // Create a user instance model with all data extracted from the request.body
    const user = await User.create( {
        name,
        email, 
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })

    sendToken(user, 200, res)
})

// User login => /api/v1/login
exports.userLogin = catchAsyncErrors(async (req, res, next) => { 

    const { email, password } = req.body;

    // Check if email and password are entered by user
    // If not send bad request error (400).
    if(!email || !password) {
        return next(new ErrorHandler('Please enter Email and Password', 400))
    }

    // If both are entered find user in database
    const user = await User.findOne({ email }).select('+password')

    // If user not found return 401 (failed authentication) method
    if(!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }

    // Check if password is correct or not with the method defined in the user model
    const isPasswordMatched = await user.comparePassword(password)

    // If password not matched return 401 (failed authentication) method
    if(!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }

    // If password matches create jwt token with the method defined in the user model
    // and store it in variable to be passed in the front end.
    sendToken(user, 200, res)
})

// Get logged in user details => /api/v1/profile
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {

    // Find user by ID, When user logged in we stored its ID in 
    // req.user (see isUserAuthenticated middleware) 
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })
})

// Update password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    // Find user by ID, When user logged in we stored its ID in 
    // req.user (see isUserAuthenticated middleware)
    // Also select the password, as its setup unselected in the User model.
    const user = await User.findById(req.user.id).select('+password');

    // Check old user password using the comparePassword method defined in the User model
    const isMatched = await user.comparePassword(req.body.oldPassword);
    // If password entered doesnt match the old password return error
    if(!isMatched) {
        return next(new ErrorHandler('Current password is incorrect', 400));
    }
    // Else update the user password with the new password entered and
    // save the user model with the new password
    user.password = req.body.password;
    await user.save();

    // Send new token as user data has changed
    sendToken(user, 200, res)
})

// Update user profile => /api/v1/profile/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    
    // Get new user data from request body
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    // If an updated avatar exists in the request
    if(req.body.avatar !== '') {

        // We first must delete the current image.
        // Find the authenticated user, get its current avatar image id and remove it
        // from your Cloudinary avatar folder.
        const user = await User.findById(req.user.id)
        const current_image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(current_image_id);

        // Upload new selected avatar image to your cloudinary avatar folder
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: 'scale'
        })

        // Add new updated image to the newUserData variable
        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }

    }

    // Update user instance with all the updated user data
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success:true,
    })
})


// User logout => /api/v1/logout
// To logout a user we simply have to clear the cookie
exports.userLogout = catchAsyncErrors(async (req, res, next) => { 

    // Set the token in the cookie to null and also change the option
    // expires to now
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success:true,
        message: 'Logged out'
    })
})

// Forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => { 

    // Find user by its email
    const user = await User.findOne({ email: req.body.email });

    if(!user) {
        return next(new ErrorHandler('User not found with this email', 404))
    }

    // If user is found, get its reset token with method defined in the user schema
    const resetToken = user.getResetPasswordToken();

    // Save token in the user, dont validate it
    await user.save({ validateBeforeSave: false })

    // ${req.protocol}://${req.get('host')}/api/v1
    // Create reset password URL to be sent by email.
    // req.protocol would be either HTTP or HTTPS - req.get.host would be either localhost or
    // your custom domain.
    const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;

    // Create message containing reset password URL to be sent by email
    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nPlease ignore
                     this email if you haven't requested it`
    
    // Try send the email
    try {
        await sendEmail({
            email: user.email,
            subject: 'Kanpai password recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })
    // If there is an error(Internal Server Error), reset the,
    // resetPasswordToken and resetPasswordExpire model fields, save it 
    // return the error
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))
    }
})

// Reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => { 

    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    // Find user by its token and make sure that expiry is greater than current time
    const user = await User.findOne({ 
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if(!user) {
        return next(new ErrorHandler('Password reset token invalid or expired', 400))
    }

    // Check new input password matches with confirm password field
    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    // If it matched set up new password
    user.password = req.body.password

    // Reset two model fields below as not needed anymore
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Save user and send the token again as user just changed his password
    await user.save()
    sendToken(user, 200, res)
})

// ADMIN CONTROLLERS

// Get all users (admin only) => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => { 
    // Get all users
    const users = await User.find()

    res.status(200).json({
        success:true,
        users
    })
})

// Get user details (admin only) => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => { 
    
    // Get user - req.params.id corresponds to /:id in the URL
    const user = await User.findById(req.params.id)

    if(!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 400))
    }

    res.status(200).json({
        success:true,
        user
    })
})

// Update user profile (admin only) => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success:true,
    })
})

// Delete user (admin only) => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    if(!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 400))
    }

    // Remove avatar from cloudinary
    const image_id = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(image_id);

    await user.remove()

    res.status(200).json({
        success:true,
    })
})