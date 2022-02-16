// Import products model
const Product = require('../models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');
// Import the products.json file, which contains all our product items data
const products = require('../data/products');

// Setting dotenv file, in this case we need it to connect our database, as
// mongos credentials are in the config.env file.
dotenv.config({ path: 'backend/config/config.env' });

// Connecting to database
connectDatabase();

// Function to upload all products from products.json file onto mongoDB products collection.
// This file is then added in the package.json file as "seeder": "node backend/utilities/seeder.js"
// Which will allow us to call this function by running "npm run seeder".
const seedProducts = async () => {

    try {
        // Delete all instances of the product model
        await Product.deleteMany();
        console.log('Products are deleted');

        // Insert an instance of the product model for each of item data in the product.json file
        await Product.insertMany(products)
        console.log('Products are added');

        process.exit()

    } catch(error) {
        console.log(error);
        process.exit();
    }
}

seedProducts()