const mongoose = require('mongoose')

const SensorSchema = new mongoose.Schema({
    name: String,
    stationID: mongoose.ObjectId
})

const model = mongoose.model('sensor', SensorSchema)

const getAllSensor = async() => await model.find({})

const getSensorIdByName = (async(name) => (await model.find({ name }))[0]._id)

const getSensorByName = (name) => new Promise((resolve, reject) => {
    model.findOne(
        {name},
        (err, data) => {
            if(err) reject(err)
            else resolve(data)
        }
    )
})

const getSensorByStationID = (stationID) => 
    new Promise((resolve, reject) => {
        model.find(
            { stationID },
            (err, data) => {
                if(err) reject(err)
                else resolve(data)
            }
        )
    }) 

const getSensorByID = async(_id) => await model.findOne({ _id }) //_id

const _convertSensorIDToName = (allSensor, sensorID) => {
    for (let i = 0; i < allSensor.length; i++) {
        if (allSensor[i]._id.toString() == sensorID.toString()) {
            return allSensor[i].name;
        }
    }
}

const _convertStationIDToSensor = (allSensor, stationID) => {
    for (let i = 0; i < allSensor.length; i++) {
        if (allSensor[i].stationID.toString() == stationID.toString()) {
            return allSensor[i]
        }
    }
}

module.exports = {
    model,
    funcs: {
        getSensorIdByName,
        getSensorByStationID,
        getSensorByID,
        _convertSensorIDToName,
        _convertStationIDToSensor,
        getAllSensor,
        getSensorByName
    }
}