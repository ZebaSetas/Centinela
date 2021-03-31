const express = require('express')
const auth = require('../../services/auth-service')
const router = express.Router()
const ROLE = require('../../models/role')
const BugController = require('../../controllers/bug-controller')
const bugController = new BugController()

router.post(''
  , auth.validateBugOrganization
  , bugController.createBug)

router.get(''
  , auth.validateUser([ROLE.ADMIN, ROLE.DEVELOPER])
  , bugController.getBugs)

router.get('/:id'
  , auth.validateUser([ROLE.ADMIN, ROLE.DEVELOPER])
  , bugController.getBug)

router.put('/:id'
  , auth.validateUser([ROLE.ADMIN, ROLE.DEVELOPER])
  , bugController.updateBug)

module.exports = router
