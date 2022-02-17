const app = require('./app')
const connectDatabase = require('./config/database')
// Import cloudinary, the package required to manage our images
const cloudinary = require('cloudinary')

// Handle Uncaught exceptions
process.on('uncaughtException', err => {

    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to Uncaught exception');
    process.exit(1)
})

// Setting up config.env file if not in production mode
if(process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config({ path: 'backend/config/config.env' })
}

// Connecting to database
connectDatabase();

// Setting up Cloudinary with config file
cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_APY_SECRET
})

// process.env.PORT and NODE_ENV refers to the config.env files respective variables
const server = app.listen(process.env.PORT, () => {

    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

// Handle Unhandled Promise rejections
process.on('unhandledRejection', err => {
    
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to Unhandles Promise rejection');
    server.close(() => {
        process.exit(1)
    })
})