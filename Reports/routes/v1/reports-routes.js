const express = require('express')
const auth = require('../../services/auth-service')
const ROLE = require('../../models/role')
const router = express.Router()
const ReportController = require('../../controllers/report-controller')
const reportController = new ReportController()

router.get('/critical'
  , auth.validateBugOrganization
  , reportController.critical)
router.get('/statistics'
  , auth.validateUser([ROLE.ADMIN])
  , reportController.statistics)
router.get('/bugs/topUsers/solved'
  , auth.validateUser([ROLE.ADMIN])
  , reportController.topUsersSolvingBugs)
router.get('/bugs/notAssigned'
  , auth.validateUser([ROLE.ADMIN])
  , reportController.bugsNotAssigned)

module.exports = router
