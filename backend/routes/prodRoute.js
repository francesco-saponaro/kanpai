const express = require('express')
const router = express.Router();

// Import controllers (views) from prodControllers file
const { getProducts, 
        getAdminProducts,
        newProduct, 
        getSingleProduct, 
        updateProduct, 
        deleteProduct,
        createProductReview,
        getProductReviews,
        deleteProductReview } = require('../controllers/prodController')

// Import isUserAuthenticated middleware to attach to routes that require authentication
// to be accessed
const { isUserAuthenticated, isUserAuthorized } = require('../middleware/auth')

// Routes
// Pair views with routes
router.route('/products').get(getProducts)
router.route('/admin/products').get(getAdminProducts)
router.route('/product/:id').get(getSingleProduct)
router.route('/admin/product/:id').put(isUserAuthenticated, isUserAuthorized('admin'), updateProduct)
                                  .delete(isUserAuthenticated, isUserAuthorized('admin'), deleteProduct)
router.route('/admin/product/new').post(isUserAuthenticated, isUserAuthorized('admin'), newProduct) // This is "post" rather than "get" as we have to post the data in the database
router.route('/review').put(isUserAuthenticated, createProductReview)
router.route('/reviews').get(isUserAuthenticated, getProductReviews)
router.route('/reviews').delete(isUserAuthenticated, deleteProductReview)

module.exports = router