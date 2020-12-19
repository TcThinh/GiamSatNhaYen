const mongoose = require('mongoose')

const UnitSchema = new mongoose.Schema({
    name: String,
})

const model = mongoose.model('unit', UnitSchema)

const getUnitIdByName = async(name) => await (model.find({ name }))[0]._id

module.exports = {
    model,
    funcs: {
        getUnitIdByName
    }

}