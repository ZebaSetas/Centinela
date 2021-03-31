const express = require('express')
  //const auth = require('../../services/auth-service')
  //const ROLE = require('../../models/role')
const PingController = require('../../controllers/ping-controller')

const pingController = new PingController()
const router = express.Router()

router.get('/', pingController.ping)

// TODO: Endpoint with authetication verification
// You must uncomment line 2 and 3 also
// router.get('/'
//   , auth.validateUser([ROLE.ADMIN, ROLE.DEVELOPER])
//   , pingController.ping)

module.exports = router
