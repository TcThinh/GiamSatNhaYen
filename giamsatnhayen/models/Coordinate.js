const mongoose = require('mongoose')

const CoordinateSchema = new mongoose.Schema({
    lat: Number,
    long: Number
})

const model = mongoose.model('coordinate', CoordinateSchema)

const add = (coor) => {
    return new Promise((resolve, reject) => {
        model.insertMany(
            [{ lat: coor.lat, long: coor.long }],
            (err, data) => {
                if(err) reject(err)
                else resolve(data)
            }
        )
    }) 
}

const getAllCoordinate = () =>  
    new Promise((resolve, reject) => {
        model.find(
            {},
            (err, data) => {
                if(err) reject(err)
                else resolve(data)
            }
        )
    })

const getCoordinateById = async(_id) => (await model.find({ _id }))[0]

const _getCoordinateByID = (allCoordinate, coordinateID) => {
    for (let i = 0; i < allCoordinate.length; i++) {
        if (allCoordinate[i]._id.toString() == coordinateID.toString()) {
            return allCoordinate[i]
        }
    }
}

module.exports = {
    model,
    funcs: {
        getCoordinateById,
        _getCoordinateByID,
        getAllCoordinate,
        add
    }
}