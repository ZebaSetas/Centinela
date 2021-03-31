const express = require('express')
const InvitationController = require('../../controllers/invitation-controller')
const invitationController = new InvitationController()
const auth = require('../../services/auth-service')
const router = express.Router()
const ROLE = require('../../models/role')

router.post(''
  , auth.validateUser([ROLE.ADMIN])
  , invitationController.createInvitation)
router.get('/:id'
  , invitationController.getInvitationDetails)
router.post('/:id'
  , invitationController.acceptInvitation)

module.exports = router
