const express = require('express')
const router = express.Router()
const controller = require('../controllers/users/register.controller')

// Login page
router.get('/login', (req, res, next) => {
    res.render('auth/login')
})

// Register page
router.get('/register', (req, res, next) => {
    res.render('auth/register')
})

// Register handle
router.post(
    '/register',
    controller.checkRegister,
    controller.storingDatabase
);

module.exports = router