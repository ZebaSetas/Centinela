const Logger = require('centinela-logger')
const logger = new Logger(__filename)
const UserService = require('../services/user-service')
const OrganizationService = require('../services/organization-service')
const Role = require('../models/role')

module.exports = class UserController {
  constructor() {
    this.userService = new UserService()
    this.organizationService = new OrganizationService()
  }

  createAdminUser = async(req, res) => {
    const initTime = new Date().getTime()
    const request = req.body
    logger.debug(
      `New request to create a new Admin user for new Organization, request is: ${JSON.stringify(request)}`
    )
    try {
      let userToCreate = request.user
      await this.userService.validateNewUser(userToCreate)
      var email = await this.userService.getByEmail(userToCreate.email)
      if (email) {
        let errorMessage = `User already exists`
        logger.error(errorMessage, initTime)
        return res.status(400).json({
          error: errorMessage
        })
      }
    } catch (userDontExists) {
      logger.debug(userDontExists) //Coulndt not find user
      try {
        let organizationToCreate = {
          name: request.name
        }
        var organization = await this.organizationService.create(
          organizationToCreate)
      } catch (err) {
        let errorMessage = `Error creating organization. ${err.message}`
        logger.error(errorMessage, initTime)
        return res.status(400).json({
          error: errorMessage
        })
      }
      try {
        let userToCreate = request.user
        await this.userService.validateNewUser(userToCreate)
        userToCreate.role = Role.ADMIN
        userToCreate.organizationId = organization.id
        var user = await this.userService.create(userToCreate)
      } catch (err) {
        let errorMessage = `Error creating user. ${err.message}`
        logger.error(errorMessage, initTime)
        return res.status(400).json({
          error: errorMessage
        })
      }
      let message =
        `Admin user created for Organization ${organization.name}`
      logger.info(message, initTime)
      return res.status(201).json({
        message
        , user
      })
    }
  }

  getUsers = async(req, res) => {
    try {
      var organizationId = req.userData.organizationId
      var initTime = new Date().getTime()
      logger.debug('Arrived request to get users with data')
      var bugs = await this.userService.getAllUsersInOrganization(
        organizationId)
      logger.debug('Get users respond OK ', initTime)
      return res.status(200).json((bugs))
    } catch (err) {
      logger.error(err, initTime)
      return res.status(400).json({
        error: err
      });
    }
  }
}
