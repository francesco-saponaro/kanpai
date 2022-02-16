// Import Mongoose
const mongoose = require('mongoose')

// Product model schema
const productSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceeed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price']
    },
    strength: {
        type: Number,
        required: [true, 'Please enter product strength']
    },
    volume: {
        type: Number,
        required: [true, 'Please enter product volume']
    },
    description: {
        type: String,
        required: [true, 'Please enter product description']
    },
    ratings: {
        type: Number,
        default:0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    category: {
        type: String,
        required: [true, 'Please enter product category'],
        enum: {
            values: [
                'Single Malt',
                'Blend',
                'Single Grain',
                'Pure Malt',
                'Single Cask',
                'New Malt'
            ],
            message: 'Please select correct category for product'
        }
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        default:0
    },
    numOfReviews: {
        type: Number,
        default:0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

// The model is called 'product' and uses the productSchema
module.exports = mongoose.model('product', productSchema) 