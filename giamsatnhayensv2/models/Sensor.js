const mongoose = require('mongoose')

const SensorSchema = new mongoose.Schema({ name: String })

const model = mongoose.model('sensor', SensorSchema)

const getSensorIdByName = async (name) => (await model.find({ name }))[0]._id

module.exports = {
	model,
	funcs : {
		getSensorIdByName
	}
}