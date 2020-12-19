const mongoose = require('mongoose')

const TestSchema = new mongoose.Schema({
    name: String,
})

const model = mongoose.model('test', TestSchema)

const getTestIdByName = async(name) => await (model.find({ name }))[0]._id

module.exports = {
    model,
    funcs: {
        getTestIdByName
    }
}