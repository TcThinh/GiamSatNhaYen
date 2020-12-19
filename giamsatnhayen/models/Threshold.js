const mongoose = require('mongoose')
const clone = require('../utils/common').clone
const Measure = require('../models/Measure')

const ThresholdSchema = new mongoose.Schema({
    min: Number,
    max: Number,
    sensorID: mongoose.ObjectId,
    measureID: mongoose.ObjectId
})

const model = mongoose.model('threshold', ThresholdSchema)

const getAllThreshold = async() => await model.find({})

const getThresholdBySensorID = (sensorID) => 
    new Promise((resolve, reject) => {
        model.find(
            { sensorID },
            (err, data) => {
                if(err) reject(err)
                else resolve(data)
            }
        )
    }) 

const getAllThresholds = async() => await model.find({})

const thresholdIndexOf = (allThreshold, measureID) => {
    for (let i = 0; i < allThreshold.length; i++) {
        if (allThreshold[i].measureID == measureID) {
            return i
        }
    }
    return -1
}

const convertSensorIDToThreshold = async(object) => {
    const _object = clone(object)
    const allThreshold = clone(global.allThreshold)
        // add measureName
    for (let i = 0; i < allThreshold.length; i++) {
        allThreshold[i].measureName = await Measure.funcs._convertMeasureIDToName(allThreshold[i].measureID)
    }
    for (let i = 0; i < _object.values.length; i++) {
        const indexOf = thresholdIndexOf(allThreshold, _object.values[i].measureID)
        if (indexOf != -1) {
            _object.values[i].threshold = allThreshold[indexOf]

        }
    }
    return _object
}

const _convertSensorIDToThreshold = async(allThreshold, sensorID) => {
    const result = []
    allThreshold.forEach(item => {
        if (item.sensorID.toString() == sensorID.toString()) {
            result.push(item)
        }
    })
    return result
}

const update = (conditions, dataUpdate) => new Promise((resolve, reject) => {
    model.findOneAndUpdate(
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
        getThresholdBySensorID,
        convertSensorIDToThreshold,
        _convertSensorIDToThreshold,
        getAllThreshold,
        update
    }
}