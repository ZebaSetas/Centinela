const express = require('express')
const LoginController = require('../../controllers/login-controller')
const loginController = new LoginController()
const router = express.Router()

router.post('', loginController.login)
module.exports = router