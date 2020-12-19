const mongoose = require('mongoose')

const StationSchema = new mongoose.Schema({
    stationID: {
        type: Number,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    coordinateID: {
        type: mongoose.ObjectId,
        required: true
    }
})

const model = mongoose.model('station', StationSchema)

const getLastestStationID = () => 
    new Promise((resolve, reject) => {
        const data = model.find().sort({_id:-1}).limit(1)
        if(data){
            resolve(data)
        } else {
            reject(new Error("Get lastest station ID failed !"))
        }

    })

const add = (infor) =>
    new Promise((resolve, reject) => {
        getLastestStationID()
        .then( data => {
            model.insertMany(
                [
                    {
                        stationID: data.stationID,
                        name: infor.stationName,
                        coordinateID: infor.coordinateID
                    }
                ],
                (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                }
            )
        })
        .catch(err => reject(err))
    })


const getStationByStationID = async (stationID) => await model.findOne({ stationID })

const getAllStation = () =>  
    new Promise((resolve, reject) => {
        model.find(
            {},
            (err, data) => {
                if(err) reject(err)
                else resolve(data)
            }
        )
    })

const _convertStationIDToName = (allStation, stationID) => {
    let name = ''
    allStation.forEach(station => {
        if (station.stationID.toString() == stationID.toString()) {
            name = station.name
        }
    })
    return name == '' ? undefined : name
}

module.exports = {
    model,
    funcs: {
        getStationByStationID,
        getAllStation,
        _convertStationIDToName,
        add,
        getLastestStationID
    }
}