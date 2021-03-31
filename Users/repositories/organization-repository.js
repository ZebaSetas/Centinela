const Repository = require('../repositories/repository')
const Logger = require('centinela-logger')
const logger = new Logger(__filename)

module.exports = class OrganizationRepository {
  constructor() {}

  async create(data) {
    try {
      let organization = await Repository.Organization.create(data)
      logger.debug(`Organization saved in BD with data: ${JSON.stringify(data)}`)
      return organization.dataValues
    } catch (err) {
      logger.error(`Error saving to the database when creating Organization: ${JSON.stringify(data)} - ${err}`)
      throw err
    }
  }

  async findById(organizationId) {
    try {
      let organization = await Repository.Organization.findOne({
        where: {
          id: organizationId
        }
      })
      return organization
    } catch (err) {
      return null
    }
  }

  async findByForeignId(foreignId) {
    try {
      let organization = await Repository.Organization.findOne({
        where: {
          foreignId: foreignId
        }
      })
      return organization
    } catch (err) {
      return null
    }
  }

}
