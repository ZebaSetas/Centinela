const express = require('express')
const SystemController = require('../../controllers/system-controller')
const systemController = new SystemController()
const auth = require('../../services/auth-service')
const router = express.Router()
const ROLE = require('../../models/role')

router.post(''
  , auth.validateUser([ROLE.ADMIN])
  , systemController.createSystem)

router.get(''
  , auth.validateUser([ROLE.ADMIN, ROLE.DEVELOPER])
  , systemController.getSystems)

router.get('/:id/environments'
  , auth.validateUser([ROLE.ADMIN, ROLE.DEVELOPER])
  , systemController.getEnvironments)

router.post('/:id/environments'
  , auth.validateUser([ROLE.ADMIN])
  , systemController.createEnvironment)

module.exports = router
