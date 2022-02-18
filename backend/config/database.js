const mongoose = require('mongoose')

// process.env.DB_LOCAL_URI refers to the config.env file DB_LOCAL_URI variable
// which corresponds to the local mongodb url.
// DB_URI refers to cloud mongodb url in which the production version database runs.
// Run one or the other depending if running application in DEVELOPMENT or PRODUCTION.
const connectDatabase = () => {
    if(process.env.NODE_ENV === 'DEVELOPMENT') {
        mongoose.connect(process.env.DB_LOCAL_URI).then(con => {
            console.log(`MongoDB database connected with HOST: ${con.connection.host}`)
        })
    } else {
        mongoose.connect(process.env.DB_URI).then(con => {
            console.log(`MongoDB database connected with HOST: ${con.connection.host}`)
        })
    }
}

module.exports = connectDatabase