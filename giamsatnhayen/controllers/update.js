// module.exports = () => {
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http);

global.io.check = true;

const receiveData = (req, res, next) => {
    global.io.on('connection', socket => {
        socket.emit('send-data', req.query.temp)
    })
    if (global.io.check == true) {
        return res.render('dashboard')
        global.io.check = false
    } else {
        return res.json({ data: req.query.temp })
    }

}


module.exports = {
    receiverData
}