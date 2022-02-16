// Import product model
const Product = require('../models/product')
// Import error handler class
const ErrorHandler = require('../utilities/errorHandler')
// Import catch async errors class
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
// Import APIFeatures class
const APIFeatures = require('../utilities/apiFeatures')
// Import cloudinary, the package required to manage our images
const cloudinary = require('cloudinary')

// All controllers which are the equivalent of "views" in Django

// Create new product => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {

    // If the "images" array from the front end equals to a string means the user
    // is uploading a single image.
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    // Upload selected images to your cloudinary products folder and
    // add their cloudinary public_id and url to the imageLinks array, to be
    // used to create a product instance with.
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }
    // Change req.body.images to the newly created imageLinks array containing cloudinary's
    // public_id and url.
    req.body.images = imagesLinks

    // Add in the request body the ID of the logged in user
    // So the product will be created with the product model user field 
    // filled with the user ID as meant to.
    req.body.user = req.user.id

    // Create a new instance of the Product model with the request body
    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product
    })
})

// Get all products => /api/v1/products or if query /api/v1/products?keyword=query
exports.getProducts = catchAsyncErrors(async (req, res, next) => {

    // Variable to be passed into the pagination method to specify amount of 
    // products per page
    const resPerPage = 4;
    // Variable to count all documents in a collection using Mongoose's countDocuments method
    const productsCount = await Product.countDocuments()

    // APIFeatures class to look for products.
    // It will return all products if no query (see apiFeatures.js file) so if we are not in the search page
    // Call it with its search, filter methods created in the class.
    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter()

    // Call the apifeatures class in order to get the count of the queried products, 
    // it is needed to adjust the pagination display in the search page based on how many products are found.
    // Must be done before attaching the pagination method to the apiFeatures class or the count would
    // be wrong.
    let products = await apiFeatures.query
    let filteredProductsCount = products.length;

    // Then after having gotten that attach the pagination method to the apiFeatures class
    // and call it again
    // On Mongoose6 we must chain the clone() method if executing the same query twice or it 
    // will throw an error
    apiFeatures.pagination(resPerPage)
    products = await apiFeatures.query.clone();

    res.status(200).json({
        success: true,
        productsCount,
        resPerPage, 
        filteredProductsCount,
        products
    })
})

// Get all products (Admin)  =>   /api/v1/admin/products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })

})

// Get single product => /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {

    // Find single product by its ID in the products collection
    const product = await Product.findById(req.params.id)

    // If product not found handle the error with the ErrorHandler class created.
    // It will communicate with the app through the middleware function.
    if(!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
        success: true,
        product
    })
})

// Update product => /api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    // Find single product by its ID in the products collection
    let product = await Product.findById(req.params.id)

    // If product not found handle the error with the ErrorHandler class created
    // It will communicate with the app through the middleware function
    if(!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    // If the "images" array from the front end equals to a string means the user
    // is uploading a single image.
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {

        // Deleting previous images associated with the product
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        let imagesLinks = [];

        // Upload selected images to your cloudinary products folder and
        // add their cloudinary public_id and url to the imageLinks array, to be
        // used to create a product instance with.
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        // Change req.body.images to the newly created imageLinks array containing cloudinary's
        // public_id and url.
        req.body.images = imagesLinks
    }

    // If product exists, update it with the request body
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })
})

// Delete product => /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {

    // Find single product by its ID in the products collection
    const product = await Product.findById(req.params.id)

    // If product not found handle the error with the ErrorHandler class created
    // It will communicate with the app through the middleware function
    if(!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    // Deleting images associated with the product
    for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    // If product exists remove it
    await product.remove()

    res.status(200).json({
        success: true,
        message: 'Product is deleted'
    })
})

// Create new review / or update review if already reviewed => /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    // Take the below fields from the front end
    const { rating, comment, productId } = req.body;
    // And put them in a object variable also containing the logged in user name and ID
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    // Find single product by its ID in the products collection
    const product = await Product.findById(productId)
    // Check if the product has already been reviewed by checking if 
    // the logged in user ID is already in one of the reviews.user field.
    // Must turn both IDs to string as all IDs are different otherwise.
    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user.id.toString()
    )

    // If the product has already been reviewed by the logged in user, find his previous 
    // review and change its comment and rating with the new data.
    if(isReviewed) {

        product.reviews.forEach(review => {
            if(review.user.toString() === req.user.id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })
    } else {

        // Otherwise push the whole review object in the reviews field
        // And set the number of reviews field to the reviews field length.
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    // Set the average ratings by summing all ratings and dividing them by the reviews length
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    // Save the product with the new data
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })
})

// Get product reviews => /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {

    // Find single product by the query ID in the products collection
    const product = await Product.findById(req.query.id)

    // Return the product reviews
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// Delete product reviews => /api/v1/reviews
exports.deleteProductReview = catchAsyncErrors(async (req, res, next) => {

    // Find single product by the query productId in the products collection
    const product = await Product.findById(req.query.productId)

    // Put into a variable all reviews apart from the review we want to delete
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    // Put into a variable the length of the reviews field
    const numOfReviews = reviews.length
    
    // Put into a variable the average of the ratings by summing all ratings and dividing them by the reviews length
    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    // Find the product by the query ID and update it with all variables above
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    // Return the product reviews
    res.status(200).json({
        success: true
    })
})
 