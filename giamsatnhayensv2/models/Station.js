const mongoose = require('mongoose')

const StationSchema = new mongoose.Schema({
    stationID: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    coordinateID: {
        type: mongoose.ObjectId,
        required: true
    },
    values: [{
        sensorID: mongoose.ObjectId,
        value: Number,
        measureID: mongoose.ObjectId
    }]
}, { _id: false })

module.exports = mongoose.model('station', StationSchema)