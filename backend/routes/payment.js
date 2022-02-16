const express = require('express')
const router = express.Router();

// Import controllers (views) from paymentControllers file
const {
    processPayment,
    sendStripeApi
} = require('../controllers/paymentController')

// We must import the isUserAuthenticated middleware to attach to the routes
const { isUserAuthenticated } = require('../middleware/auth')

// Routes
// Pair views with routes
router.route('/payment/process').post(isUserAuthenticated, processPayment);
router.route('/stripeapi').get(isUserAuthenticated, sendStripeApi);

module.exports = router;