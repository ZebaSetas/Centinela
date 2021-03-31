const Logger = require('centinela-logger')
const logger = new Logger(__filename)
const InvitationService = require('../services/invitation-service')

module.exports = class InvitationController {
  constructor() {
    this.invitationService = new InvitationService()
  }

  createInvitation = async(req, res) => {
    const initTime = new Date().getTime()
    const invited = req.body
    console.log(invited)
    const adminData = req.userData
    logger.debug("Arrived request to create an invitation with data: " + JSON.stringify(req.body), initTime)
    try {
      InvitationService.validateInvitation(invited)
      var invitation = await this.invitationService.sendInvitation(invited, adminData)
    } catch (err) {
      logger.error(`Create invitation failed: ${err.message}`, initTime)
      return res.status(400).json({
        error: err.message
      })
    }
    logger.info(`New invitation created in the system. Data: ${JSON.stringify(invitation)}`, initTime)
    return res.status(201).json({
      invitation
    })
  }

  getInvitationDetails = async(req, res) => {
    const initTime = new Date().getTime()
    const invitationId = Number.parseInt(req.params.id)
    logger.debug(`Arrived request to get invitation details, id: ${invitationId}`, initTime)
    try {
      var invitation = await this.invitationService.getPendingInvitation(invitationId)
        //Remove email property for security
      invitation.invitedEmail = undefined
      return res.status(200).json({
        invitation
      })
    } catch (err) {
      logger.error(
        `There was an issue getting pending invitation with id: ${invitationId}. Details: ${err.message}`
        , initTime)
      return res.status(400).json({
        error: err.message
      })
    }
  }

  acceptInvitation = async(req, res) => {
    const initTime = new Date().getTime()
    try {
      const invitationId = Number.parseInt(req.params.id)
      const newUserInfo = req.body
      const invitation = await this.invitationService.getPendingInvitation(
        invitationId)
      if (invitation.invitedEmail.toUpperCase() !== newUserInfo.email.toUpperCase()) {
        logger.error(
          `Invitation did not pass email validation: Invited: ${invitation.invitedEmail}, Received: ${newUserInfo.email}`
          , initTime)
        throw new Error(`This invitation was not sent to provided email`)
      }
      InvitationService.validateAcceptance(newUserInfo)
      let acceptance = {
        name: req.body.name
        , email: invitation.invitedEmail
        , password: req.body.password
        , role: invitation.role
        , organizationId: invitation.organizationId
        , invitationId: invitationId
      }
      let createdUser = await this.invitationService.acceptInvitation(
        acceptance)
      return res.status(201).json({
        createdUser
      })
    } catch (err) {
      logger.error(`Error accepting invitation, Details: ${err.message}`, initTime)
      return res.status(400).json({
        error: err.message
      })
    }
  }
}
