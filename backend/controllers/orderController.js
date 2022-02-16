// Import order model
const Order = require('../models/order')
// Import product model
const Product = require('../models/product')
// Import error handler class
const ErrorHandler = require('../utilities/errorHandler')
// Import catch async errors class
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

// All controllers, equivalent of "views" in Django

// Create new order => /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {

    // Extract all below fields from the front end
    // and create a new order in the database with it.
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(), // Also add paid at as if the order is created means its paid
        user: req.user._id
    })

    // Update (subtract) the stock of the ordered items with the update
    // stock function defined below.
    orderItems.forEach(async item => {

        // .product will equal the item ID and .quantity the amount of each ordered item 
        await updateStock(item.product, item.quantity)
    })

    res.status(200).json({
        success: true,
        order
    })
});

// Function to update amount of stock when product is created
async function updateStock(id, quantity) {

    // Find product by ID
    const product = await Product.findById(id)
    // And reduce its stock field by the quantity bought
    product.stock = product.stock - quantity
    // Save new model data
    await product.save({ validateBeforeSave: false })
}

// Get single order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {

    // Find single order by its ID in the orders collection
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    // If order not found handle the error with the ErrorHandler class created
    // It will communicate with the app through the middleware function.
    if(!order) {
        return next(new ErrorHandler('Order not found with this ID', 404));
    }

    res.status(200).json({
        success: true,
        order
    })
})

// Get logged in user orders => /api/v1/orders/profile
exports.myOrders = catchAsyncErrors(async (req, res, next) => {

    // Find logged in user orders in the orders collection
    const orders = await Order.find({ user: req.user.id })

    res.status(200).json({
        success: true,
        orders
    })
})

// ADMIN CONTROLLERS

// Get all orders (Admin only) => /api/v1/admin/orders
exports.allOrders = catchAsyncErrors(async (req, res, next) => {

    // Find all orders in the orders collection, admin only
    const orders = await Order.find()

    let totalAmount = 0
    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

// Update / Process order (Admin only) => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {

    // Find order in the orders collection, admin only
    const order = await Order.findById(req.params.id)

    if(order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('This order has already been delivered', 400));
    }

    // Update the order status and deliveredAt fields
    order.orderStatus = req.body.status
    order.deliveredAt = Date.now()
    
    // Save the order model instance with the new data
    await order.save()

    res.status(200).json({
        success: true
    })
})

// Delete order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {

    // Find single order by its ID in the orders collection
    const order = await Order.findById(req.params.id)

    // If order not found handle the error with the ErrorHandler class created.
    // It will communicate with the app through the middleware function.
    if(!order) {
        return next(new ErrorHandler('Order not found with this ID', 404));
    }

    // If order is not 'Delivered' when deleting the order, which means the items are
    // then still in stock, add the stock back to the respective items
    if(order.orderStatus !== 'Delivered') {

        // Increase the stock of the ordered items with the increase
        // stock function defined below.
        order.orderItems.forEach(async item => {

            // .product will equal the item ID and .quantity the amount of each ordered item 
            await increaseStock(item.product, item.quantity)
        })
    }

    // If found delete the order 
    await order.remove()

    res.status(200).json({
        success: true
    })
})

// Function to add stock amount back to items, when product is deleted while not 'Delivered'
async function increaseStock(id, quantity) {

    // Find product by ID
    const product = await Product.findById(id)

    // And increase its stock field by the quantity in the order
    product.stock = product.stock + quantity

    // Save new model data
    await product.save({ validateBeforeSave: false })
}