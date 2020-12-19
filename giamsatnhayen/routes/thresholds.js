const express = require('express')
const router = express.Router()
const controller = require('../controllers/thresholds')

router.post('/setHost', controller.setHost)

router.post('/update', controller.update)

module.exports = router