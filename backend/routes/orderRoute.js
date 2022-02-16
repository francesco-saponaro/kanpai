const express = require('express')
const router = express.Router();

// Import controllers (views) from ordercontrollers file
const { newOrder, getSingleOrder, myOrders, allOrders, updateOrder, deleteOrder  } = require('../controllers/orderController')

// Import isUserAuthenticated middleware to attach to routes that require authentication
// to be accessed.
const { isUserAuthenticated, isUserAuthorized } = require('../middleware/auth')

// Routes
// Pair views with routes 
router.route('/order/new').post(isUserAuthenticated, newOrder)
router.route('/order/:id').get(isUserAuthenticated, getSingleOrder)
router.route('/orders/profile').get(isUserAuthenticated, myOrders)
router.route('/admin/orders').get(isUserAuthenticated, isUserAuthorized('admin'), allOrders)
router.route('/admin/order/:id').put(isUserAuthenticated, isUserAuthorized('admin'), updateOrder)
                                .delete(isUserAuthenticated, isUserAuthorized('admin'), deleteOrder)

module.exports = router