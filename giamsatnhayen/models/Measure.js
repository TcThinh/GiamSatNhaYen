const mongoose = require('mongoose')
const { all } = require('../routes/users')
const clone = require('../utils/common').clone

const MeasureSchema = new mongoose.Schema({
    name: String,
    unitID: mongoose.ObjectId,
    description: String
})

const model = mongoose.model('measure', MeasureSchema)

const getMeasureByName = (name) => new Promise((resolve, reject) => {
    model.findOne(
        {name},
        (err, data) => {
            if(err) reject(err)
            else resolve(data)
        }
    )
})

const getMeasureIdByName = async(name) => (await model.findOne({ name }))

const getMeasureByID = async(_id) => await model.findOne({ _id })

const getAllMeasure = async() => await model.find({})

// all data station
/*
    {
        stationID,
        ...,
        values [
            {
              ...,
              measureID,
              ...      
            }
        ]
    }
*/

const measureIndexOf = (allMeasure, measureID) => {
    for (let i = 0; i < allMeasure.length; i++) {
        if (allMeasure[i]._id == measureID) {
            return i
        }
    }
    return -1
}

const convertMeasureIDtoName = async(object) => {
    const _object = clone(object)
    const allMeasure = global.allMeasure // array
    const length = _object.values.length
    for (let i = 0; i < length; i++) {
        const indexOf = measureIndexOf(allMeasure, _object.values[i].measureID)
        if (indexOf != -1) {
            _object.values[i].measureName = allMeasure[indexOf].name
        }
    }
    return _object
}

const _convertMeasureIDtoUnitName = async(allMeasure, allUnit, measureID) => {
    let unitID = ''
    for (let i = 0; i < allMeasure.length; i++) {
        if (allMeasure[i]._id == measureID) {
            unitID = allMeasure[i].unitID
            break;
        }
    }
    if (unitID == '') return undefined
    for (let i = 0; i < allUnit.length; i++) {
        if (allUnit[i]._id.toString() == unitID.toString()) {
            return allUnit[i].name
        }
    }
    return undefined
}

const _convertMeasureIDToName = async(allMeasure, measureID) => {
    for (let i = 0; i < allMeasure.length; i++) {
        if (allMeasure[i]._id == measureID) {
            return allMeasure[i].name
        }
    }
}

module.exports = {
    model,
    funcs: {
        getMeasureIdByName,
        getMeasureByID,
        getAllMeasure,
        convertMeasureIDtoName,
        _convertMeasureIDtoUnitName,
        _convertMeasureIDToName,
        getMeasureByName
    }

}