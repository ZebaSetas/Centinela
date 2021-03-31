const Ajv = require('ajv')
const config = require('config')
require('dotenv').config()
const Role = require('../models/role')
const InvitationRepository = require('../repositories/invitation-repository')
const MailerService = require('./mailer-service')
const OrganizationService = require('./organization-service')
const UserService = require('./user-service')
const ajv = new Ajv()
const Logger = require('centinela-logger')
const logger = new Logger(__filename)

const InvitationSchema = {
  "properties": {
    "email": {
      "type": "string"
      , "format": "email"
    }
    , "role": {
      "type": "integer"
    }
  }
  , "required": ["email", "role"]
}
const acceptanceSchema = {
  "properties": {
    "email": {
      "type": "string"
      , "format": "email"
    }
    , "name": {
      "type": "string"
    }
    , "password": {
      "type": "string"
    }

  }
  , "required": ["email", "name", "password"]
}

module.exports = class InvitationService {
  constructor() {
    this.userService = new UserService()
    this.mailerService = new MailerService()
    this.organizationService = new OrganizationService
    this.invitationRepository = new InvitationRepository()
  }

  static validateInvitation(invited) {
    const validate = ajv.compile(InvitationSchema)
    let valid = validate(invited)
    if (!valid)
      throw Error(
        `The format of provided invitation body is invalid: ${validate.errors[0].message}`
      )
    return true
  }

  async sendInvitation(invited, adminData) {
    try {
      await this.userService.getByEmail(invited.email)
    } catch (error) { //Invited user does not exist  in system
      try {
        const admin = await this.userService.getByEmail(adminData.user.email)
        const organization = await this.organizationService.getById(admin.organizationId)
        if (!Object.values(Role).includes(invited.role)) {
          logger.error(
            `Invitation validation failed: Specified role is not in the list of available roles. Role:${invited.role}`
          )
          throw new Error(`Specified role is not in the list of available roles`)
        }
        let preInvitation = {
          adminName: admin.name
          , organizationId: organization.id
          , organizationName: organization.name
          , invitedEmail: invited.email
          , userId: admin.id
          , role: invited.role
        }
        let invitationDb =
          await this.invitationRepository.create(preInvitation)
        invitationDb.uri = `${process.env.FRONT_END_MAIN_URL}/register/${invitationDb.id}`
        invitationDb.organizationId = organization.foreignId
        await this.mailerService.sendInvitationEmail(invitationDb)
        logger.info(`Invitation created successfully for email:${preInvitation.invitedEmail}`)
        return invitationDb
      } catch (err) {
        throw new Error(`Error on sending invitation, Details: ${err.message}`)
      }
    }
    //User exists in the system already
    let message =
      `Could not send invitation, ${invited.email} already has an account in the System`
    logger.error(message)
    throw new Error(message)
  }

  async getPendingInvitation(invitationId) {
    let invitation = await this.invitationRepository.getById(invitationId)
    const organization = await this.organizationService.getById(invitation.organizationId)
    invitation.organizationId = organization.foreignId
    if (invitation.status != config.invitation.PENDING) {
      logger.error(
        `The invitation requested has expired or has already been accepted. Invitation ID: ${invitationId}`
      )
      throw new Error(`The invitation requested has expired or has already been accepted`)
    }
    return invitation
  }

  static validateAcceptance(acceptance) {
    const validate = ajv.compile(acceptanceSchema)
    let valid = validate(acceptance)
    if (!valid)
      throw new Error(`The format of provided acceptance body is invalid: ${validate.errors[0].message}`)
    return true
  }

  async acceptInvitation(acceptance) {
    console.log(acceptance);
    logger.debug(`User is trying to accept invitation. Detail: ${JSON.stringify(acceptance)}`)
    try {
      const organization = await this.organizationService.getByForeignId(acceptance.organizationId)
      acceptance.organizationId = organization.id
      let user = await this.userService.create(acceptance)
      logger.debug(`User created by accepting invitation: ${JSON.stringify(user)}`)
      let invitations = await this.invitationRepository.getByInvitedEmail(acceptance.email)
      invitations.forEach(invitation => {
        let data = {
          status: config.invitation.DENIED
        }
        if (acceptance.invitationId === invitation.id)
          data.status = config.invitation.CONFIRMED
        logger.debug(`This invitation ${JSON.stringify(invitation)} is being set as: ${data.status}`)
        this.invitationRepository.update(data, invitation.id)
      })
      return user
    } catch (err) {
      logger.error(`Error accepting invitation, Details: ${err.message}`)
      throw new Error(`Error accepting invitation, Details: ${err.message}`)
    }
  }
}
