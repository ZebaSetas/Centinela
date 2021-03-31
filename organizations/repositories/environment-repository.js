const Logger = require('centinela-logger')
const logger = new Logger(__filename)

const Repository = require('../repositories/repository')

module.exports = class EnvironmentRepository {
  constructor() {}

  async findAllBySystemId(id) {
    var query = {
      where: {
        systemId: id
      }
    }
    return await Repository.Environment.findAll(query)
  }

  async create(data) {
    try {
      let env = await Repository.Environment.create(data)
      logger.debug(
        `Environment created in DB with data: ${JSON.stringify(data)}`)
      return env
    } catch (err) {
      const messaege =
        `Error in the database when creating an Environment ${JSON.stringify(data)}: ${err.messaege}`
      logger.error(messaege)
      throw new Error(messaege)
    }
  }

  async update(data, id) {
    try {
      const environment = await Repository.Environment.update(data, {
        where: {
          id: id
        }
        , returning: true
      })
      logger.debug(
        `Environment updated in DB with data: ${JSON.stringify(data)}`)
      return environment[1][0]
    } catch (err) {
      const messaege =
        `Error in the database when updating an Environment ${JSON.stringify(data)}: ${err.messaege}`
      logger.error(messaege)
      throw new Error(messaege)
    }
  }

}
