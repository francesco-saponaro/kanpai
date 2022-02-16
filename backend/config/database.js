const mongoose = require('mongoose')

// process.env.DB_LOCAL_URI refers to the config.env file DB_LOCAL_URI variable
// which corresponds to the local mongodb url
const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI).then(con => {
        console.log(`MongoDB database connected with HOST: ${con.connection.host}`)
    })
}

module.exports = connectDatabase