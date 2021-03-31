const Logger = require('centinela-logger')
const logger = new Logger(__filename)
const OrganizationService = require('../services/organization-service')

module.exports = class OrganizationController {
  constructor() {
    this.organizationService = new OrganizationService()
  }

  getOrganizationbyId = async(req, res) => {
    const organizationId = Number.parseInt(req.params.id)
    logger.debug(
      `Arrived request to get organization, id: ${organizationId}`)
    try {
      var organization = await this.organizationService.getById(
        organizationId)
      return res.status(200).json({
        organization
      })
    } catch (err) {
      logger.error(
        `There was an issue getting organization with id: ${organizationId}. Details: ${err.message}`
      )
      return res.status(400).json({
        error: err.message
      });
    }
  }

  getAllOrganizations = async(req, res) => {
    logger.debug(`Arrived request to get all organizations`)
    try {
      var organizations = await this.organizationService.getAll()
      return res.status(200).json(organizations)
    } catch (err) {
      logger.error(
        `There was an issue getting organizations. Details: ${err.message}`
      )
      return res.status(400).json({
        error: err.message
      });
    }
  }

  createOrganization = async(req, res) => {
    logger.debug(`Arrived request to save an organization`)
    var org = req.body
    try {
      this.organizationService.validate(org)
      var newOrg = await this.organizationService.create(org)
      return res.status(201).json(newOrg)
    } catch (err) {
      logger.error(
        `There was an issue saving a new Organization. Details: ${err.message}`
      )
      return res.status(400).json({
        error: err.message
      });
    }
  }
}
