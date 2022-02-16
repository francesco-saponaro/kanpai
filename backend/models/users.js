// Import Mongoose
const mongoose = require('mongoose');
const validator = require('validator');
// Import package used to Encrypt password
const bcrypt = require('bcryptjs')
// Import package used to release jwt token
const jwt = require('jsonwebtoken')
// Import crypto package used to reset password
// This package is included no need to install it.
const crypto = require('crypto')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required : [true, 'Please enter your name'],
        maxlength: [30, 'Your name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required : [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required : [true, 'Please enter your password'],
        minlength: [6, 'Your password cannot be less than 6 characters'],
        // Select false so this wont be returned when calling user details
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

// Encrypting password before saving user.
// Must use "function" syntax instead of => as we need to use "this"
// and "this" cannot be used with an arrow function.
userSchema.pre('save', async function(next) {

    if(!this.isModified('password')) {
        next()
    }
    // 10 is the salt value, which is the length of the hash
    this.password = await bcrypt.hash(this.password, 10)
})

// Define compare entered password with user password method.
// .compare is the bcrypt method that allows you to compare two passwords.
userSchema.methods.comparePassword = async function(enteredPassword) {

    return await bcrypt.compare(enteredPassword, this.password)
}

// Define JWT token method, which will send an encrypted user name to the front end.
// We pass the user's id as payload for the jwt token.
userSchema.methods.getJwtToken = function() {

    return jwt.sign({ id:this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

// Generate password reset token
userSchema.methods.getResetPasswordToken = function() {

    // Generate token with the crypto package
    const resetToken = crypto.randomBytes(20).toString('hex')

    // Set the resetPasswordToken (see above) to the resetToken hashed value
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // Set the resetPasswordExpire to last 30 minutes (converted in milliseconds)
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000 

    return resetToken
}

// The model is called 'user' and uses the userSchema
module.exports = mongoose.model('User', userSchema);