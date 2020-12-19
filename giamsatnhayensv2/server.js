const express = require('express')
const app = express()
const mongoose = require('mongoose')
const utils = require('./utils/common')
const bodyParser = require('body-parser')
const PORT = 1337
global.hostToSetThresholdsForEsp32 = ""

// DB Config
//const db = require('./config/keys').MongoURI
const db = "mongodb://localhost:27017/giamsatnhayendb"
const stationName = require('./config/keys').DEFAULT_STATION_NAME
// Connect To MongoDB

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('mongo db connected'))
    .catch(() => console.log('err'))

// Models
const Values = require('./models/Values')
const Sensor = require('./models/Sensor')
const Measure = require('./models/Measure')
const Test = require('./models/Test')

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/dh11', async (req, res, next) => {

    console.log(`${req.body.station}, ${req.body.temperature} *C ${req.body.humidity} %`)

    const { station, temperature, humidity } = req.query

    const sensorID = await Sensor.funcs.getSensorIdByName('dh11') // dh11 route

    const tempMeasureID = await Measure.funcs.getMeasureIdByName('temperature')

    const humiMeasureID = await Measure.funcs.getMeasureIdByName('humidity')

    console.log(utils.timeNow())
    const temperatureValue = {
        sensorID,
        value: parseFloat(temperature),
        measureID: tempMeasureID,
        date: utils.timeNow()
    }

    const humidityValue = {
        sensorID,
        value: parseFloat(humidity),
        measureID: humiMeasureID,
        date: utils.timeNow()
    }

    Values.model.updateOne({ stationID: parseInt(station) }, {
        $push: {
            values: {
                $each: [temperatureValue, humidityValue]
            }
        }
    },
        (err, success) => {
            if (err) console.log(err)
            else console.log('insert success')
        }
    )

    res.send(`${req.body.station}, ${req.body.temperature} *C ${req.body.humidity} %`)
})

app.post('/dh11', async (req, res, next) => {

    console.log(`${req.body.station}, ${req.body.temperature} *C ${req.body.humidity} %`)

    const { station, temperature, humidity } = req.body

    const sensorID = await Sensor.funcs.getSensorIdByName('dh11') // dh11 route

    const tempMeasureID = await Measure.funcs.getMeasureIdByName('temperature')

    const humiMeasureID = await Measure.funcs.getMeasureIdByName('humidity')

    console.log(utils.timeNow())
    const temperatureValue = {
        sensorID,
        value: parseFloat(temperature),
        measureID: tempMeasureID,
        date: utils.timeNow()
    }

    const humidityValue = {
        sensorID,
        value: parseFloat(humidity),
        measureID: humiMeasureID,
        date: utils.timeNow()
    }

    Values.model.updateOne({ stationID: parseInt(station) }, {
        $push: {
            values: {
                $each: [temperatureValue, humidityValue]
            }
        }
    },
        (err, success) => {
            if (err) console.log(err)
            else console.log('insert success')
        }
    )

    res.send(`${req.body.station}, ${req.body.temperature} *C ${req.body.humidity} %`)
})

// route
app.get('/', (req, res, next) => {
    res.send('<h1>This is my temp server</h1>')
})

app.listen(PORT, () => console.log(`Server runing on port ${PORT}`))