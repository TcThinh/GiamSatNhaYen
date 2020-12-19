const mongoose = require('mongoose')

const MeasureSchema = new mongoose.Schema({
    name: String,
    unitID: mongoose.ObjectId,
    description: String
})

const model = mongoose.model('measure', MeasureSchema)

const getMeasureIdByName = async (name) => (await model.find({name}))[0]._id

module.exports = {
	model,
	funcs: {
		getMeasureIdByName
	}

}