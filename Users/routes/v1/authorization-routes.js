const express = require('express')
const AuthorizationController = require(
  '../../controllers/authorization-controller')
const authorizationController = new AuthorizationController()
const router = express.Router()

router.get('/validate', authorizationController.validate)
module.exports = router
