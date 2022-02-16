const express = require('express')
const router = express.Router();

// Import controllers (views) from userControllers file
const { 
    registerUser, 
    userLogin, 
    userLogout, 
    forgotPassword, 
    resetPassword,
    getUserProfile, 
    updatePassword,
    updateProfile,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser} = require('../controllers/usersController')

// We must import the isUserAuthenticated middleware to attach to the user profile route,
// and the isUserAuthorized middleware to attach to admin related routes.
const { isUserAuthenticated, isUserAuthorized } = require('../middleware/auth')

// Routes
// Pair views with routes
router.route('/register').post(registerUser) 
router.route('/login').post(userLogin)
router.route('/logout').get(userLogout)
router.route('/profile').get(isUserAuthenticated, getUserProfile)
router.route('/password/update').put(isUserAuthenticated, updatePassword) // "put" request as we are updating data
router.route('/profile/update').put(isUserAuthenticated, updateProfile) // "put" request as we are updating data
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword) // "put" request as we are updating data
router.route('/admin/users').get(isUserAuthenticated, isUserAuthorized('admin'), allUsers)
router.route('/admin/user/:id').get(isUserAuthenticated, isUserAuthorized('admin'), getUserDetails)
                               .put(isUserAuthenticated, isUserAuthorized('admin'), updateUser)
                               .delete(isUserAuthenticated, isUserAuthorized('admin'), deleteUser)

module.exports = router;