const express = require('express')
const router = express.Router()
const controller = require('../controllers/stations')

router.post('/add', controller.add)

router.get('/', (req, res, next) => res.send('stations add router'))

module.exports = router