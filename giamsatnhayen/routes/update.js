const router = require('express').Router()
controller = require('../controllers/update')

router.get('/', controller.receiverData)

router.get('/', (req, res, next) => {

    io.on('connection', socket => {
        console.log('connected!')
    })

    res.render('dashboard')
})


module.exports = router