const db = require('../config/keys').MongoURI_LOCAL
const mongoose = require('mongoose')
module.exports = () => new Promise((resolve, reject) => {
    mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then((connection) => resolve(connection))
        .catch((error) => reject(error))
})