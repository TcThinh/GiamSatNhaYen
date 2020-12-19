const express = require('express')
const router = express.Router()
const controller = require('../controllers/dashboard')

router.get('/', controller.loadAllData, controller.renderPage)

module.exports = router