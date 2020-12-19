const path = require('path');
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const io = require('socket.io')(http);
const port = process.env.PORT || 3000
global.hostToSetThresholdsForEsp32 = ""

// Global variables
global.io = io

app.use(express.static(path.join(__dirname, 'public')));
    // Body Parser
app.use(bodyParser.urlencoded({ extended: false }))

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Routes 
app.use('/', require('./routes/dashboard'))
app.use('/stations', require('./routes/stations'))
app.use('/users', require('./routes/users'))
app.use('/thresholds', require('./routes/thresholds'))
app.use('/map', (req, res, next) => {
    res.send('map')
})

app.post('/dh11', async(req, res, next) => {
    console.log("thanh cong")
    res.send('dh11 route')
})


// Load data from cloud mongodb and display first view
const load = require('./databases/load');

global.io.sockets.on('connection', (socket) => {
    load.loadMap()
    load.loadLiveChart()
    load.loadStaticChart()
    //load.loadTable()
})

// Realtime Data
require('./databases/changeStream')()



http.listen(port, () => console.log(`server running on port ${port}`))


































// io.sockets.on('connection', (socket) => {
//     console.log(`a user connected with id = ${socket.id}`) 
//     sendData(socket) 
// }) 

// function sendData(socket) {
//     socket.emit('data', random()) 
//     setTimeout(() => {
//         sendData(socket) 
//     }, 300) 

// }

// app.get('/', (req, res, next) => {
//     res.render('index.ejs', {
//         value: 666
//     }) 
// })