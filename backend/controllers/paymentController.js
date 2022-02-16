const catchAsyncErrors = require('../middleware/catchAsyncErrors')

// Import Stripe package with the the secret key
const stripe = require('stripe')(process.env.STRIPE_APY_SECRET);

// Process stripe payments   =>   /api/v1/payment/process
exports.processPayment = catchAsyncErrors(async (req, res, next) => {

    // Create a payment intent, as required by Stripe, with the amount from the Front end
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'usd',
        metadata: { integration_check: 'accept_a_payment' }
    });

    // Pass to the Front end the client secret created by the Payment intent
    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    })

})

// Send stripe API Key to the Front end   =>   /api/v1/stripeapi
exports.sendStripeApi = catchAsyncErrors(async (req, res, next) => {

    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    })

})