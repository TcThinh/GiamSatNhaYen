const Coordinate = require('../models/Coordinate');
const Station = require('../models/Station');


module.exports = {
    add: (req, res, next) => {
        const inforStation = req.body

        Coordinate.funcs.add(
            { 
                lat: inforStation.lat, 
                long: inforStation.long 
            })
        .then( newCoor => {
            inforStation.coordinateID = newCoor[0]._id
            return Station.funcs.add(inforStation)
        })
        .then( newStation => {
            res.send(
                {
                    _id: newStation[0]._id,
                    coordinate:{
                        lat: inforStation.lat,
                        long: inforStation.long 
                    },
                    stationID: newStation[0].stationID,
                    name: newStation[0].name,
                }
            )
        })

    }
}