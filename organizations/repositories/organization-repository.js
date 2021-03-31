const Repository = require('../repositories/repository')
const Logger = require('centinela-logger')
const logger = new Logger(__filename)

module.exports = class OrganizationRepository {
  constructor() {}

  async save(data) {
    try {
      let organization = await Repository.Organization.create(data)
      logger.debug(
        `Organization saved in BD with data: ${JSON.stringify(data)}`)
      return organization
    } catch (err) {
      let errorMessage = `Error saving to the database when creating Organization: - ${err.errors[0].message}`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  async findById(organizationId) {
    try {
      let org = await Repository.Organization.findByPk(organizationId)
      if (!org)
        throw new Error(`Id ${organizationId} not found`)
      return org
    } catch (err) {
      logger.error(`Error querying the database: Details ${err.message}`)
      throw err
    }
  }

  async findAll() {
    try {
      return await Repository.Organization.findAll()
    } catch (err) {
      logger.error(`Error querying the database: Details ${err.message}`)
      throw err
    }
  }

  async findByName(name) {
    try {
      let organization = await Repository.Organization.findOne({
        name: name
      })
      return organization
    } catch (err) {
      logger.error(`Error querying the database: Details ${err.message}`)
      throw err
    }
  }
}
