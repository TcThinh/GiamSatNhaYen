const mongoose = require('mongoose')

const ThresholdSchema = new mongoose.Schema({
    min: Number,
    max: Number,
    sensorID: mongoose.ObjectId,
    measureID: mongoose.ObjectId
})

const model = mongoose.model('threshold', ThresholdSchema)

const update = (conditions, dataUpdate) => new Promise((resolve, reject) => {
    model.updateMany(
        { 
            sensorID: conditions.sensorID, 
            measureID: conditions.measureID
        },
        {
            $set: {
                min: dataUpdate.min,
                max: dataUpdate.max
            }
        },
        (err, doc) => {
            if(err) reject(err)
            else resolve(doc)
        }
    )
})

module.exports = {
    model,
    funcs: {
        update
    }
}