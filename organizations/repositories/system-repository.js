const Logger = require('centinela-logger')
const logger = new Logger(__filename)

const Repository = require('../repositories/repository')

module.exports = class SystemRepository {
  constructor() {}

  async findAllByOrganizationId(id) {
    var query = {
      where: {
        organizationId: id
      , }
      , include: ["environments"]
    }
    return await Repository.System.findAll(query)
  }

  async getById(systemId) {
    try {
      let bug = await Repository.System.findOne({
        where: {
          id: systemId
        }
      })
      return bug
    } catch (err) {
      logger.error(err)
      var message = 'Cant find system in BD with id ' + systemId + ': ' +
        err.message
      logger.error(message)
      throw Error(message)
    }
  }

  async create(data) {
    try {
      let system = await Repository.System.create(data)
      logger.debug(
        `System created in DB with data: ${JSON.stringify(data)}`)
      return system
    } catch (err) {
      const messaege =
        `Error in the database when creating a System ${JSON.stringify(data)}: ${err.messaege}`
      logger.error(messaege)
      throw new Error(messaege)
    }
  }
}
