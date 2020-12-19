const mongoose = require('mongoose')
const utils = require('../utils/common')
const Measure = require('../models/Measure')
const Unit = require('../models/Unit')
const Threshold = require('./Threshold')
const timeNow = () => {
    const date = new Date()
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth()
    const day = date.getUTCDay()
    const hour = date.getUTCHours()
    const minute = date.getUTCMinutes()
    const second = date.getSeconds()
    const time = new Date(Date.UTC(year, month, day, hour, minute, second));
    return time.toLocaleString('en-US', { timeZone: "Asia/Bangkok" })
}

const ValueSchema = new mongoose.Schema({
    stationID: Number,
    values: [{
        sensorID: mongoose.ObjectId,
        value: Number,
        measureID: mongoose.ObjectId,
        date: {
            type: String,
            default: timeNow()
        }
    }]
})

const model = mongoose.model('value', ValueSchema)

const getAllData = async() => await model.find({})

const getValueByStationID = (_id) => 
    new Promise((resolve, reject) => {
        model.findOne(
            { _id }, 
            { values: { $slice: [-2, 2] } },
            (err, data) => {
                if(err) reject(err)
                else resolve(data)
            }
        )
    })



const getAverageByDate = async(allValues, type, stationID, date) => {
    const result = {}
        // aver type measure
    const stationConverted = await Measure.funcs.convertMeasureIDtoName(allValues)
    const regex = new RegExp(`^${date}.`)
    const elemMatch = []
    for (let i = 0; i < stationConverted.values.length; i++) {
        const item = stationConverted.values[i]
        if (regex.test(item.date) && item.measureName === type) {
            elemMatch.push(item.value)
        }
    }
    result.countMeasure = elemMatch.length
    result.aver = parseFloat(utils.average(elemMatch).toFixed(2))
    const _allValues = await Threshold.funcs.convertSensorIDToThreshold(allValues)

    let count = 0
    for (let i = 0; i < _allValues.values.length; i++) {
        const item = _allValues.values[i]
        if (regex.test(item.date) && item.threshold.measureName == type) {
            if (item.value > item.threshold.max || item.value < item.threshold.min) {
                count++;
            }
        }
    }
    result.overTheshold = count
    return result
}

module.exports = {
    model,
    funcs: {
        getAllData,
        getValueByStationID,
        getAverageByDate
    }
}