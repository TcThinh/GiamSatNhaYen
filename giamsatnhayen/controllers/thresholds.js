const Threshold = require('../models/Threshold')
const Sensor = require('../models/Sensor')
const Measure = require('../models/Measure')

module.exports = {
    setHost: (req, res, next) => {
        const { host } = req.body
        if(host != ""){
            global.hostToSetThresholdsForEsp32 = host
        }
        global.io.emit('hostEsp32', global.hostToSetThresholdsForEsp32)
        res.send(global.hostToSetThresholdsForEsp32)
    },
    update: (req, res, next) => {
        const { tempMin, tempMax, humiMin, humiMax } = req.body
        let sensorID
        let measureIDTemperature
        let measureIDHumidity
        Sensor.funcs.getSensorByName('dh11')
        .then(sensor => {
            sensorID = sensor._id
            console.log(sensorID)
        })

        Measure.funcs.getMeasureByName('temperature')
        .then(measure => {
            measureIDTemperature = measure._id
            console.log(measureIDTemperature)
        })

        Measure.funcs.getMeasureByName('humidity')
        .then(measure => {
            measureIDHumidity = measure._id
            console.log(measureIDHumidity)
        })

        Threshold.funcs.update(
            { sensorID,  measureID: measureIDTemperature },
            { min: tempMin, max: tempMax }     
        )
        .then(data => {
            console.log('update temperature successed !')
            console.log(data)
        })

        Threshold.funcs.update(
            { sensorID,  measureID: measureIDHumidity },
            { min: humiMin, max: humiMax }     
        )
        .then(data => {
            console.log('update humidity successed !')
            console.log(data)
        })
    }
}