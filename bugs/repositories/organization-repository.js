const Repository = require('../repositories/repository')
const Logger = require('centinela-logger')
const logger = new Logger(__filename)

module.exports = class OrganizationRepository {
  constructor() {}
  async findByForeignId(id) {
    try {
      let organization = await Repository.Organization.findOne({
        where: {
          foreignId: id
        }
      })
      return organization
    } catch (err) {
      logger.error('Cant find organization in BD with id ' + id + ': ' +
        err)
      throw Error('Cant find organization in BD with id ' + id)
    }
  }

  async create(organization) {
    return await Repository.Organization.create(organization)
  }
}
