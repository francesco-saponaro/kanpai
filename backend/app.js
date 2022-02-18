const express = require('express');
const app = express();
// Import installed body parser and cookie parser middlewares,
// body-parser is the NodeJS body parsing middleware. It is responsible for parsing the 
// incoming request bodies in a middleware before you handle it.
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
// express-fileupload is an express middleware for uploading files.
const fileUpload = require('express-fileupload')
const path = require('path')

// Setting up config.env file if not in PRODUCTION mode, as in production the config files are uploaded
// from Heroku
if(process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config({ path: 'backend/config/config.env' })
}

// Import middleware function from the errors.js file to handle errors
const errorMiddleware = require('./middleware/errors')

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(fileUpload()) 

// Import all routes from routes files
const products = require('./routes/prodRoute');
const users = require('./routes/userRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/payment');

// The app will use the below url, which is /api/v1 + any route in the routes files 
app.use('/api/v1', products);
app.use('/api/v1', users);
app.use('/api/v1', order);
app.use('/api/v1', payment);

// If in PRODUCTION mode run the app with the 'build' folder, which is an optimized version
// of the app for deployment
if(process.env.NODE_ENV === 'PRODUCTION') {

    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}

// The app will use the middleware function from the errors.js file to handle errors
app.use(errorMiddleware);

// Exporting it to be used in server.js
module.exports = app;