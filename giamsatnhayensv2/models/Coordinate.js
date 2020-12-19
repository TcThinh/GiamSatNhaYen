const mongoose = require('mongoose')

const CoordinateSchema = new mongoose.Schema({
    lat: Number,
    long: Number
})

module.exports = mongoose.model('coordinate', CoordinateSchema)