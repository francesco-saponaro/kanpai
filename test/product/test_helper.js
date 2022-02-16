const mongoose = require('mongoose');

// Connect to MongoDB Kanpai collection on localhost with each test
mongoose.connect("mongodb://localhost:27017/kanpai", {useNewUrlParser: true, useUnifiedTopology: true});
  
mongoose.connection
    .once('open', () => console.log('Connected!'))
    .on('error', (error) => {
        console.warn('Error : ', error);
    });
      