const express = require('express')
const PingController = require('../../controllers/ping-controller')

const pingController = new PingController()
const router = express.Router()

router.get('/', pingController.ping)

module.exports = router
