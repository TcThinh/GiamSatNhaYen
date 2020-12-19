const mongoose = require('mongoose')

const ValueSchema = new mongoose.Schema({
    stationID: Number,
    values: [{
        sensorID: mongoose.ObjectId,
        value: Number,
        measureID: mongoose.ObjectId,
	    date: String
    }]
})

const model = mongoose.model('value', ValueSchema)

module.exports = {
    model,
    funcs: {

    }
}