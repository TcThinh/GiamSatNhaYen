const mongoose = require('mongoose')

const UnitSchema = new mongoose.Schema({
    name: String,
})

const model = mongoose.model('unit', UnitSchema)

const getUnitByName = async(name) => await (model.findOne({ name }))

const getUnitByMeasureID = async(measureID) => (await model.findOne({ measureID }))

const getUnitByID = async(_id) => await (model.findOne({ _id }))

const getAllUnit = async() => await model.find({})

module.exports = {
    model,
    funcs: {
        getUnitByName,
        getUnitByID,
        getUnitByMeasureID,
        getAllUnit
    }

}